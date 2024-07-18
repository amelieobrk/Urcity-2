import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401)
  }

  const client = await clientPromise

  await client
    .db('urcity2').collection('scenes')
    .updateOne(
      { _id: req.query.scene_id },
      { $pull: { ratings: { account: session.account } } }
    )

  // Update average rating
  await client
    .db('urcity2').collection('scenes')
    .updateOne(
      { _id: req.query.scene_id },
      [ { $set: { averageStars: { $avg: '$ratings.stars' } }} ]
    )

  res.status(200).json()
}
