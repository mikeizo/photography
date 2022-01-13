import express from 'express'
import bodyParser from 'body-parser'
import sgMail from '@sendgrid/mail'
import { ObjectId } from 'mongodb'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../utils/mongodb'
import { date } from '../utils/date'
import authenticateJWT from '../utils/authenticate'
import { uploadPhotos, deletePhoto } from '../utils/upload'

const app = express()
app.use(bodyParser.json())

// Get Settings
app.get('/api/settings', async (req, res) => {
  const { db } = await connectToDatabase()
  const settings = await db.collection('settings').findOne({})

  res.status(200).json(settings)
})

// Update settings
app.post('/api/settings', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const {
    _id,
    title,
    subtitle,
    about,
    metaDescription,
    metaKeywords,
    metaTitle
  } = await req.body

  const updateDoc = {
    $set: {
      title,
      subtitle,
      about,
      metaDescription,
      metaKeywords,
      metaTitle,
      updated_at: date()
    }
  }

  await db.collection('settings').updateOne({ _id: ObjectId(_id) }, updateDoc)

  res.status(201).send()
})

/**
 * Contact Form
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, comments } = req.body
  const regex = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

  // Form validation
  if (!name || name.length > 30 || name.length < 3) {
    return res.sendStatus(400)
  }
  if (!email || email.length > 50 || !regex.test(email)) {
    return res.sendStatus(400)
  }
  if (comments && comments.length > 300) {
    return res.sendStatus(400)
  }

  const content = {
    to: process.env.CONTACT_EMAIL,
    from: 'no-reply@stevelphotography.com',
    subject: 'Website Contact Form',
    html: `<strong>Name: </strong>${name}<br>
           <strong>Email: </strong>${email}<br>
           <strong>Comments: </strong>${comments}`
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send(content)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
  }
})

/**
 * Photos
 */
// List Photos
app.get('/api/photos', async (req, res) => {
  const { db } = await connectToDatabase()
  const { category } = req.query
  const filter = {}

  if (category) {
    filter.category = category
  }

  const photos = await db
    .collection('photos')
    .find(filter)
    .sort({ created_at: -1 })
    .toArray()

  res.status(200).json(photos)
})

// Edit Photo
app.post('/api/photos/edit/:id', authenticateJWT, async (req, res) => {
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
app.post('/api/photos/delete', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const photos = req.body

  if (Array.isArray(photos)) {
    photos.forEach(async function (element) {
      // Delete from MongoDB
      await db.collection('photos').deleteOne({ _id: ObjectId(element._id) })
      // Delete from AWS
      deletePhoto(element)
    })
  } else {
    // Delete from MongoDB
    await db.collection('photos').deleteOne({ _id: ObjectId(photos._id) })
    // Delete from AWS
    deletePhoto(photos)
  }
  res.sendStatus(200)
})

// Upload photos
app.post(
  '/api/photos/upload',
  authenticateJWT,
  uploadPhotos.array('photos', 40),
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

/**
 * Categories
 */
// List Categories
app.get('/api/categories', async (req, res) => {
  const { db } = await connectToDatabase()
  const categories = await db
    .collection('categories')
    .find({})
    .sort({ name: 1 })
    .toArray()

  res.json(categories)
})

// Edit Category
app.post('/api/categories/edit/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params
  const { name, color } = await req.body

  const updateDoc = {
    $set: {
      name,
      color,
      updated_at: date()
    }
  }

  await db.collection('categories').updateOne({ _id: ObjectId(id) }, updateDoc)

  res.sendStatus(201)
})

// Delete Category
app.delete('/api/categories/:id', authenticateJWT, async (req, res) => {
  const { db } = await connectToDatabase()
  const { id } = req.params

  // Remove all instances of category in photos collection
  await db
    .collection('photos')
    .updateMany({}, { $pull: { category: { $in: [id] } } }, { multi: true })

  await db.collection('categories').deleteOne({ _id: ObjectId(id) })

  res.sendStatus(200)
})

// Add new Category
app.post('/api/categories', authenticateJWT, async (req, res) => {
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

/**
 * Auth
 */
// Login
app.post('/api/auth/login', async (req, res) => {
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

export default app
