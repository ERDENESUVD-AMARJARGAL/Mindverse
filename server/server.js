const express = require('express')
const fs = require('fs').promises
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

// ── Environment Validation ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is required in production')
        process.exit(1)
    }
    if (!process.env.ALLOWED_ORIGINS) {
        console.warn('⚠️ ALLOWED_ORIGINS not set, using defaults')
    }
}

const app = express()
const PORT = process.env.PORT || 3000
const DB_PATH = path.join(__dirname, 'db.json')
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist')
const MID_ROOT = path.join(__dirname, '..', '..', 'mid')

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindverse'
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error', err)
    })

// ── Middleware ────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
])

app.use(cors({
    origin(origin, cb) {
        if (!origin || allowedOrigins.has(origin)) return cb(null, true)
        if (!isProduction) return cb(null, true) // Дослух үе шатанд урсгал өгөх
        return cb(new Error('CORS not allowed'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))

// ── Rate Limiting (Basic) ─────────────────────────────────
const requestCounts = new Map()
const RATE_LIMIT = 100 // requests
const RATE_WINDOW = 60000 // 1 minute in ms

app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, [])
    }
    
    const requests = requestCounts.get(ip)
    requestCounts.set(ip, requests.filter(time => now - time < RATE_WINDOW))
    
    const currentRequests = requestCounts.get(ip)
    if (currentRequests.length >= RATE_LIMIT) {
        return res.status(429).json({ error: 'Too many requests, please try again later' })
    }
    
    currentRequests.push(now)
    next()
})

// Clean up old entries every 10 minutes
setInterval(() => {
    const now = Date.now()
    for (const [ip, requests] of requestCounts) {
        const filtered = requests.filter(time => now - time < RATE_WINDOW)
        if (filtered.length === 0) {
            requestCounts.delete(ip)
        } else {
            requestCounts.set(ip, filtered)
        }
    }
}, 600000)

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// ── DB Helpers (MongoDB via Mongoose) ─────────────────────
const User = require('./models/User')
const Class = require('./models/Class')
const Task = require('./models/Task')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

async function readDB() {
    const users = await User.find({}).lean()
    const classes = await Class.find({}).lean()
    const tasks = await Task.find({}).lean()
    return { users: users || [], classes: classes || [], tasks: tasks || [] }
}

async function writeDB(data) {
    // Replace collections with provided data (suitable for small/local datasets)
    if (data.users) {
        await User.deleteMany({})
        if (data.users.length) await User.insertMany(data.users)
    }
    if (data.classes) {
        await Class.deleteMany({})
        if (data.classes.length) await Class.insertMany(data.classes)
    }
    if (data.tasks) {
        await Task.deleteMany({})
        if (data.tasks.length) await Task.insertMany(data.tasks)
    }
}

function avgClassName(avgNum) {
    if (avgNum >= 80) return 'good'
    if (avgNum >= 60) return 'mid'
    return 'low'
}

function scoresFromClass(cls) {
    const scores = []

    ;[...(cls.exams || []), ...(cls.assignments || [])].forEach(item => {
        ;(item.submissions || []).forEach(sub => {
            const score = Number(sub.score)
            if (Number.isFinite(score)) scores.push(score)
        })
    })

    if (!scores.length && Array.isArray(cls.studentList)) {
        cls.studentList.forEach(student => {
            const score = Number(student.score)
            if (Number.isFinite(score) && score > 0) scores.push(score)
        })
    }

    return scores
}

function refreshClassStats(cls) {
    if (!cls) return cls

    cls.students = Array.isArray(cls.studentList) ? cls.studentList.length : (cls.students || 0)

    const scores = scoresFromClass(cls)
    const avgNum = scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0

    cls.avgNum = avgNum
    cls.avg = scores.length ? `${avgNum}%` : '-'
    cls.avgClass = scores.length ? avgClassName(avgNum) : 'mid'

    if (Array.isArray(cls.studentList)) {
        cls.studentList = cls.studentList.map(student => {
            const studentScores = []
            ;[...(cls.exams || []), ...(cls.assignments || [])].forEach(item => {
                ;(item.submissions || []).forEach(sub => {
                    if (sub.studentId === student.id || sub.id === student.id) {
                        const score = Number(sub.score)
                        if (Number.isFinite(score)) studentScores.push(score)
                    }
                })
            })

            if (!studentScores.length) return student
            const score = Math.round(studentScores.reduce((sum, n) => sum + n, 0) / studentScores.length)
            return { ...student, score }
        })
    }

    return cls
}

function syncMembership(db) {
    const classes = db.classes || []
    const users = db.users || []
    const usersById = new Map(users.map(user => [user.id, user]))

    classes.forEach(cls => {
        const seen = new Set()
        cls.studentList = (cls.studentList || []).filter(student => {
            if (!student?.id || seen.has(student.id)) return false
            seen.add(student.id)
            return true
        })

        cls.studentList = cls.studentList.map(student => {
            const user = usersById.get(student.id)
            return {
                ...student,
                firstName: student.firstName || user?.firstName,
                lastName: student.lastName || user?.lastName,
                av: student.av || (student.firstName || user?.firstName || 'U')[0],
                joinedAt: student.joinedAt || new Date().toISOString(),
            }
        })

        const studentIds = new Set(cls.studentList.map(student => student.id))
        ;[...(cls.exams || []), ...(cls.assignments || [])].forEach(item => {
            item.submissions = (item.submissions || []).filter(sub => studentIds.has(sub.studentId || sub.id))
        })
        ;(cls.assignments || []).forEach(assignment => {
            assignment.submitted = (assignment.submissions || []).length
            assignment.total = cls.studentList.length
        })

        refreshClassStats(cls)
    })

    users.forEach(user => {
        if (user.role !== 'student') return

        const membershipIds = classes
            .filter(cls => (cls.studentList || []).some(student => student.id === user.id))
            .map(cls => cls.id)

        user.classId = Array.from(new Set(membershipIds))

        user.classProgress = user.classProgress || {}
        user.classId.forEach(classId => ensureClassProgress(user, classId))
    })
}

function safeUser(user) {
    if (!user) return null
    const { password, ...safe } = user
    return safe
}

function ensureClassProgress(user, classId) {
    user.classProgress = user.classProgress || {}
    user.classProgress[classId] = user.classProgress[classId] || {
        completedLessons: [],
        completedAssignments: [],
        joinedAt: new Date().toISOString()
    }
    return user.classProgress[classId]
}

// ── AUTH ──────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Мэдээлэл дутуу байна' })

    const user = await User.findOne({ email }).lean()
    if (!user) return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' })

    const match = await bcrypt.compare(password, user.password || '')
    if (!match) return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' })

    const { password: _, ...safeUser } = user
    res.json({ success: true, user: safeUser })
})

// ── USERS ─────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
    const { email } = req.query
    const db = await readDB()
    let users = db.users || []
    if (email) users = users.filter(u => u.email === email)
    res.json(users.map(({ password, ...u }) => u))
})

app.get('/api/users/:id', async (req, res) => {
    const db = await readDB()
    const user = db.users.find(u => u.id === req.params.id)
    if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    const { password: _, ...safeUser } = user
    res.json(safeUser)
})

app.post('/api/users',
    body('email').isEmail().withMessage('Имэйл буруу байна'),
    body('password').isLength({ min: 6 }).withMessage('Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой'),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const { email, password, ...rest } = req.body
        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ error: 'Энэ имэйл аль хэдийн бүртгэгдсэн байна' })

        const hashed = await bcrypt.hash(password, 10)
        const newUser = { id: rest.id || `user_${Date.now()}`, email, password: hashed, ...rest }
        if (!Array.isArray(newUser.classId)) newUser.classId = newUser.classId ? [newUser.classId] : []

        const created = await User.create(newUser)
        const safe = safeUser(created.toObject ? created.toObject() : created)
        res.status(201).json(safe)
    }
)

app.patch('/api/users/:id', async (req, res) => {
    const db = await readDB()
    const idx = db.users.findIndex(u => u.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    db.users[idx] = { ...db.users[idx], ...req.body }
    await writeDB(db)
    const { password: _, ...safeUser } = db.users[idx]
    res.json(safeUser)
})

app.delete('/api/users/:id', async (req, res) => {
    const db = await readDB()
    const idx = db.users.findIndex(u => u.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })

    const user = db.users[idx]
    if (Array.isArray(user.classId)) {
        user.classId.forEach(cid => {
            const cls = db.classes.find(c => c.id === cid)
            if (cls?.studentList) {
                cls.studentList = cls.studentList.filter(s => s.id !== req.params.id)
            }
        })
    }
    db.users.splice(idx, 1)
    await writeDB(db)
    res.json({ success: true })
})

// ── CLASSES ───────────────────────────────────────────────
app.get('/api/classes', async (req, res) => {
    const { teacherId, studentId, classCode } = req.query
    const db = await readDB()
    syncMembership(db)
    let classes = db.classes || []

    if (classCode) {
        classes = classes.filter(c => c.classCode === classCode)
    } else if (teacherId) {
        classes = classes.filter(c => c.teacherId === teacherId)
    } else if (studentId) {
        const user = db.users.find(u => u.id === studentId)
        if (user?.classId) {
            const ids = Array.isArray(user.classId) ? user.classId : [user.classId]
            classes = classes.filter(c => ids.includes(c.id))
        } else {
            classes = []
        }
    }
    res.json(classes)
})

app.post('/api/classes', async (req, res) => {
    const db = await readDB()
    db.classes.push(req.body)
    await writeDB(db)
    res.status(201).json(req.body)
})

app.patch('/api/classes/:id', async (req, res) => {
    const db = await readDB()
    const idx = db.classes.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Анги олдсонгүй' })
    db.classes[idx] = { ...db.classes[idx], ...req.body }
    syncMembership(db)
    await writeDB(db)
    res.json(db.classes[idx])
})

app.delete('/api/classes/:id', async (req, res) => {
    const db = await readDB()
    const classId = req.params.id
    const before = db.classes.length
    db.classes = db.classes.filter(c => c.id !== classId)
    if (db.classes.length === before) return res.status(404).json({ error: 'Анги олдсонгүй' })

    db.users.forEach(user => {
        if (Array.isArray(user.classId)) {
            user.classId = user.classId.filter(id => id !== classId)
        }
    })
    await writeDB(db)
    res.json({ success: true })
})

// ── TASKS ─────────────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
    const db = await readDB()
    res.json(db.tasks || [])
})

app.post('/api/tasks', async (req, res) => {
    const db = await readDB()
    const { studentId, reward } = req.body

    if (studentId && Number(reward) > 0) {
        const userIdx = db.users.findIndex(u => u.id === studentId)
        if (userIdx === -1) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
        const balance = Number(db.users[userIdx].balance) || 0
        const amount = Number(reward)
        if (balance < amount) return res.status(400).json({ error: 'Дансны үлдэгдэл хүрэлцэхгүй байна' })
        db.users[userIdx].balance = balance - amount
    }

    const newTask = { id: req.body.id || 'task_' + Date.now(), status: 'open', postedAt: new Date().toISOString(), ...req.body }
    db.tasks = db.tasks || []
    db.tasks.push(newTask)
    await writeDB(db)
    res.status(201).json(newTask)
})

app.patch('/api/tasks/:id', async (req, res) => {
    const db = await readDB()
    const idx = db.tasks.findIndex(t => t.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Даалгавар олдсонгүй' })

    const task = db.tasks[idx]
    const nextStatus = req.body.status
    const reward = Number(task.reward) || 0

    if (nextStatus && nextStatus !== task.status) {
        if (nextStatus === 'completed' && task.status === 'claimed' && task.claimedBy && reward > 0) {
            const teacher = db.users.find(u => u.id === task.claimedBy)
            if (teacher && !task.paidOutAt) {
                teacher.balance = (Number(teacher.balance) || 0) + reward
                req.body.paidOutAt = new Date().toISOString()
            }
        }

        if ((nextStatus === 'rejected' || nextStatus === 'cancelled') && !['rejected', 'cancelled', 'completed'].includes(task.status) && task.studentId && reward > 0) {
            const student = db.users.find(u => u.id === task.studentId)
            if (student && !task.refundedAt) {
                student.balance = (Number(student.balance) || 0) + reward
                req.body.refundedAt = new Date().toISOString()
            }
        }
    }

    db.tasks[idx] = { ...task, ...req.body }
    await writeDB(db)
    res.json(db.tasks[idx])
})

app.put('/api/tasks/:id', async (req, res) => {
    const db = await readDB()
    const idx = db.tasks.findIndex(t => t.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Даалгавар олдсонгүй' })
    db.tasks[idx] = { ...db.tasks[idx], ...req.body }
    await writeDB(db)
    res.json(db.tasks[idx])
})

// ── JOIN CLASS ────────────────────────────────────────────
app.post('/api/join-class', async (req, res) => {
    const { studentId, classCode, joinCost = 1000 } = req.body
    if (!studentId || !classCode) return res.status(400).json({ error: 'Мэдээлэл дутуу байна' })

    const db = await readDB()
    const targetClass = db.classes.find(c => c.classCode === classCode)
    if (!targetClass) return res.status(404).json({ error: 'Ангийн код буруу байна' })

    const user = db.users.find(u => u.id === studentId)
    if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    if (user.role === 'teacher') return res.status(400).json({ error: 'Багшийн эрхээр ангид нэгдэх боломжгүй' })

    if (!user.classId) user.classId = []
    if (!Array.isArray(user.classId)) user.classId = [user.classId]
    if (!targetClass.studentList) targetClass.studentList = []

    const alreadyIn = user.classId.includes(targetClass.id)
    if (alreadyIn) return res.status(400).json({ error: 'Та энэ ангид аль хэдийн бүртгүүлсэн байна' })

    const price = Number(joinCost) || 0
    if ((Number(user.balance) || 0) < price) {
        return res.status(400).json({ error: 'Дансны үлдэгдэл хүрэлцэхгүй байна' })
    }

    user.classId.push(targetClass.id)
    user.balance = (Number(user.balance) || 0) - price
    ensureClassProgress(user, targetClass.id)

    const teacher = db.users.find(u => u.id === targetClass.teacherId)
    if (teacher) teacher.balance = (Number(teacher.balance) || 0) + price

    targetClass.studentList.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        av: (user.firstName || 'U')[0],
        color: '#dbeafe',
        tc: '#1d4ed8',
        joinedAt: new Date().toISOString(),
        score: 0
    })
    syncMembership(db)

    await writeDB(db)
    res.json({ success: true, message: 'Амжилттай нэгдлээ', className: targetClass.name, user: safeUser(user), teacher: safeUser(teacher), class: targetClass })
})

// ── START ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ ok: true, app: 'Mindverse API' })
})

app.use('/legacy', express.static(MID_ROOT))
app.use(express.static(CLIENT_DIST))
app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api')) return next()

    res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => {
        if (!err) return
        res.sendFile(path.join(MID_ROOT, 'html', 'index.html'), (fallbackErr) => {
            if (fallbackErr) next(fallbackErr)
        })
    })
})

// ── ERROR HANDLER ─────────────────────────────────────────
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message
    
    console.error(`[ERROR] ${status}: ${err.message}`)
    console.error(err.stack)
    
    res.status(status).json({ 
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { details: err.message })
    })
})

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})
