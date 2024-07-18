import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401)
  }

  const client = await clientPromise

  const result = await client
    .db('urcity2').collection('scenes')
    .deleteOne(
      {
        _id: req.query.scene_id,
        account: session.account
      },
    )

  if (result.deletedCount) {
    res.status(200).json()
  } else {
    res.status(401).json() // Unauthorized
  }
}
