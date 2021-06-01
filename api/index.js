import express from 'express'
import bodyParser from 'body-parser'
import sgMail from '@sendgrid/mail'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../utils/mongodb'
import { date } from '../utils/date'
import authenticateJWT from '../utils/authenticate'

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).json('test - get').end()
})

app.post('/test', (req, res) => {
  res.status(200).json('test - post').end()
})

// Get Settings
app.get('/settings', async (req, res) => {
  const { db } = await connectToDatabase()
  const settings = await db.collection('settings').findOne({})

  res.status(200).json(settings)
})

// Update settings
app.post('/settings', authenticateJWT, async (req, res) => {
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
app.post('/contact', async (req, res) => {
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

export default app
