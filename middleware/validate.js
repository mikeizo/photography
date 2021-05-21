import { verify } from 'jsonwebtoken'

export default function ({ redirect, $auth }) {
  const token = $auth.strategy.token.get().split(' ')[1]

  verify(token, process.env.HASH_SECRET, (err) => {
    if (process.server && err) {
      return redirect('/admin/login')
    }
  })
}
