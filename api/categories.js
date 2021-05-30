import express from 'express'
import bodyParser from 'body-parser'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../utils/mongodb'
import { date } from '../utils/date'
import authenticateJWT from '../utils/authenticate'

const app = express()
app.use(bodyParser.json())

// List Categories
app.get('/api', async (req, res) => {
  const { db } = await connectToDatabase()
  const categories = await db
    .collection('categories')
    .find({})
    .sort({ name: 1 })
    .toArray()

  res.json(categories)
})

// Edit Category
app.post('/api/edit/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params
  const { name, color, oldName } = await req.body

  const updateDoc = {
    $set: {
      name,
      color,
      updated_at: date()
    }
  }

  await db.collection('categories').updateOne({ _id: ObjectId(id) }, updateDoc)

  // Update all categories in photos collection
  if (name !== oldName) {
    await db
      .collection('photos')
      .updateMany({ category: oldName }, { $set: { 'category.$': name } })
  }

  res.sendStatus(201)
})

// Delete Category
app.delete('/api/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params
  const { name } = await req.body.item

  // Remove all instances of category in photos collection
  await db
    .collection('photos')
    .updateMany({}, { $pull: { category: { $in: [name] } } }, { multi: true })

  await db.collection('categories').deleteOne({ _id: ObjectId(id) })

  res.sendStatus(200)
})

// Add new Category
app.post('/api/', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { name, color } = await req.body
  const insertDoc = {
    name,
    color,
    created_at: date()
  }

  await db.collection('categories').insertOne(insertDoc)

  res.sendStatus(201)
})

export default app
