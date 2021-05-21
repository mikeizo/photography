import { verify } from 'jsonwebtoken'

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    verify(token, process.env.HASH_SECRET, (err, user) => {
      if (err || user.role !== 0) {
        return res.sendStatus(403)
      }

      next()
    })
  } else {
    return res.sendStatus(401)
  }
}

export default authenticateJWT
