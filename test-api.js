const http = require('http')

const endpoints = [
    { path: '/api/health', method: 'GET', name: 'Health Check' },
    { path: '/api/users', method: 'GET', name: 'Users List' },
    { path: '/api/classes', method: 'GET', name: 'Classes List' },
    { path: '/api/tasks', method: 'GET', name: 'Tasks List' },
]

console.log('\n' + '='.repeat(60))
console.log('🔍 API ENDPOINT HEALTH CHECK')
console.log('='.repeat(60) + '\n')

let completed = 0

endpoints.forEach((endpoint, index) => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: endpoint.path,
        method: endpoint.method,
        timeout: 5000
    }

    const req = http.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
            const status = res.statusCode === 200 ? '✅' : '⚠️'
            console.log(`${status} ${endpoint.name.padEnd(25)} | Status: ${res.statusCode} | Response: ${data.substring(0, 60)}...`)
            completed++
            if (completed === endpoints.length) {
                console.log('\n' + '='.repeat(60) + '\n')
                process.exit(0)
            }
        })
    })

    req.on('error', (err) => {
        console.log(`❌ ${endpoint.name.padEnd(25)} | Error: ${err.message}`)
        completed++
        if (completed === endpoints.length) {
            console.log('\n' + '='.repeat(60) + '\n')
            process.exit(1)
        }
    })

    req.on('timeout', () => {
        req.destroy()
        console.log(`⏱️  ${endpoint.name.padEnd(25)} | Timeout`)
        completed++
        if (completed === endpoints.length) {
            console.log('\n' + '='.repeat(60) + '\n')
            process.exit(1)
        }
    })

    req.end()
})
