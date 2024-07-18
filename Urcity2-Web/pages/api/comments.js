import { v4 as uuidv4 } from 'uuid'
import clientPromise from '../../lib/mongodb'

export default async function handle(req, res) {
  const client = await clientPromise //Warte bis clientPromise dann zuweisung an client

  if (req.method === 'POST') {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Comment not found' })
    }

    const comment = { //Comment besitzt festgelegte ID; Text und Datenstring
      _id: uuidv4(),
      text,
      dateString: new Date().toISOString(),
    }

    //Was wird in Datenbank gespeichert 

    const result = await client
      .db('urcity2').collection('comments')
      .insertOne(comment)

    res.status(200).json(comment)
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
