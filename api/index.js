const app = require('express')()

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end('Hello! Go to item:')
})

app.get('/test', (req, res) => {
  res.status(200).json('test - get').end()
})

app.post('/', (req, res) => {
  res.status(200).json('test - post').end()
})

module.exports = app
