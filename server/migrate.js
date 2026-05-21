require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs').promises
const path = require('path')

const User = require('./models/User')
const Class = require('./models/Class')
const Task = require('./models/Task')
const bcrypt = require('bcryptjs')

async function main(){
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindverse'
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('Connected to MongoDB for migration')

  const dbPath = path.join(__dirname, 'db.json')
  const raw = await fs.readFile(dbPath, 'utf8')
  const db = JSON.parse(raw)

  if (Array.isArray(db.users) && db.users.length) {
    console.log(`Importing ${db.users.length} users...`)
    await User.deleteMany({})
    // ensure createdAt fields are Dates
    const users = db.users.map(u => ({ ...u, createdAt: u.createdAt ? new Date(u.createdAt) : new Date() }))
    await User.insertMany(users)

    // Hash any plaintext passwords already inserted (if not bcrypt hash)
    const all = await User.find({})
    for (const u of all) {
      try {
        if (u.password && typeof u.password === 'string' && !u.password.startsWith('$2')) {
          const hashed = await bcrypt.hash(u.password, 10)
          await User.updateOne({ _id: u._id }, { $set: { password: hashed } })
        }
      } catch (err) {
        console.warn('Failed to hash password for user', u.id, err)
      }
    }
  }

  if (Array.isArray(db.classes) && db.classes.length) {
    console.log(`Importing ${db.classes.length} classes...`)
    await Class.deleteMany({})
    const classes = db.classes.map(c => ({ ...c, createdAt: c.createdAt ? new Date(c.createdAt) : new Date() }))
    await Class.insertMany(classes)
  }

  if (Array.isArray(db.tasks) && db.tasks.length) {
    console.log(`Importing ${db.tasks.length} tasks...`)
    await Task.deleteMany({})
    const tasks = db.tasks.map(t => ({ ...t, postedAt: t.postedAt ? new Date(t.postedAt) : new Date() }))
    await Task.insertMany(tasks)
  }

  console.log('Migration finished')
  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err => {
  console.error('Migration error', err)
  process.exit(1)
})
