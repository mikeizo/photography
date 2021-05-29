const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end('Hello! Go to item:')
})

app.get('/api/test', (req, res) => {
  res.status(200).json('test - get').end()
})

app.post('/api', (req, res) => {
  res.status(200).json('test - post').end()
})

module.exports = app
