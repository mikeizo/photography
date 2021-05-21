import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../utils/mongodb'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// Login
app.post('/login', async (req, res) => {
  const { db } = await connectToDatabase()
  const { username, password } = req.body
  const user = await db.collection('users').findOne({ username })

  // hash(password, 10, function (err, hash) { console.log(hash) })

  if (user) {
    compare(password, user.password, function (err, result) {
      if (!err && result) {
        const accessToken = {
          sub: user._id,
          username: user.username,
          role: user.role
        }
        const token = jwt.sign(accessToken, process.env.HASH_SECRET, {
          expiresIn: '1h'
        })
        res.status(200).send(token)
      } else {
        res.sendStatus(401)
      }
    })
  } else {
    res.sendStatus(401)
  }
})

module.exports = app
