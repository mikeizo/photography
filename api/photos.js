import express from 'express'
import bodyParser from 'body-parser'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../utils/mongodb'
import { date } from '../utils/date'
import authenticateJWT from '../utils/authenticate'

const app = express()
const upload = require('../utils/upload')

app.use(bodyParser.json())

// List Photos
app.get('/', async (req, res) => {
  const { db } = await connectToDatabase()
  const { category } = req.query
  const filter = {}

  if (category) {
    filter.category = category
  }

  const photos = await db
    .collection('photos')
    .find(filter)
    .sort({ created_at: 1 })
    .toArray()

  res.status(200).json(photos)
})

// Edit Photo
app.post('/edit/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params
  const { category, title } = await req.body

  const updateDoc = {
    $set: {
      title,
      category,
      updated_at: date()
    }
  }

  await db.collection('photos').updateOne({ _id: ObjectId(id) }, updateDoc)

  res.sendStatus(201)
})

// Delete Photo
app.delete('/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params

  await db.collection('photos').deleteOne({ _id: ObjectId(id) })

  // Delete from AWS

  res.sendStatus(200)
})

// Upload photos
app.post(
  '/upload',
  authenticateJWT,
  upload.array('photos', 40),
  async (req, res) => {
    try {
      // Save to MongoDB
      const { db } = await connectToDatabase()
      const insertDoc = req.files.map((photo) => {
        return {
          filename: photo.originalname,
          category: [],
          created_at: date()
        }
      })
      await db.collection('photos').insertMany(insertDoc)

      res.sendStatus(201)
    } catch (err) {
      res.sendStatus(500)
    }
  }
)

export default app
