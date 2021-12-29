import { S3, config } from 'aws-sdk'
const multer = require('multer')
const multerS3 = require('multer-s3')

/**
 * UPLOAD FILES
 */
config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION_APP
})

const s3 = new S3()

export const uploadPhotos = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, `photography/photos/${file.originalname}`)
    }
  })
})

export const deletePhoto = (photoData) => {
  s3.deleteObject(
    {
      Bucket: process.env.AWS_BUCKET,
      Key: `photography/photos/${photoData.filename}`
    },
    (err) => {
      console.error(err)
    }
  )
}
