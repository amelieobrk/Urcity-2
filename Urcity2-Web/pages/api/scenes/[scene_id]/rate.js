import { object, number, string } from 'yup'
import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

export default async function handle(req, res) {
  // Validate request body
  let rating = await object({
    stars: number().required().integer().min(1).max(5),
    comment: string(),
  }).noUnknown().validate(req.body)

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send("You need to be logged in")
    return
  }

  rating = {
    ...rating,
    account: session.account,
    user: session.user,
    dateString: new Date().toISOString(),
  }

  const client = await clientPromise

  // We want to do an upsert, that is we want to update the rating if the account already has one and insert otherwise.
  // MongoDB doesn't have upsert for arrays so we're doing this in two steps.

  // If there is no rating by this account yet, add the rating to the front of the list.
  const result = await client
    .db('urcity2').collection('scenes')
    .updateOne(
      { _id: req.query.scene_id, 'ratings.account': { $ne: session.account } },
      { $push: { ratings: { $each: [rating], $position: 0 } } }
    )

  if (result.matchedCount === 0) {
    // Now that we know there was already a rating by this account we can update it.
    await client
      .db('urcity2').collection('scenes')
      .updateOne(
        { _id: req.query.scene_id, 'ratings.account': session.account },
        { $set: { 'ratings.$': rating } }
      )
  }

  // Update average rating
  await client
    .db('urcity2').collection('scenes')
    .updateOne(
      { _id: req.query.scene_id },
      [ { $set: { averageStars: { $avg: '$ratings.stars' } }} ]
    )

  res.status(200).json(rating)
}
