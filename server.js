const http = require('http')
const https = require('https')
const fs = require('fs')
const app = require('./app')

const PORT = process.env.PORT || 8080

const httpServer = http.createServer(app)
const httpServers = https.createServer(
  {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
  },
  app
)

httpServer.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}`)
})

httpServers.listen(8083, () => {
  console.log(`HTTPS server is running on port ${8083}`)
})
