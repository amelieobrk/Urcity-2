import { object, string, array } from 'yup'
import clientPromise from '../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { v4 as uuidv4 } from 'uuid';

async function handleGET(req, res) {
  const { perPage, page, sort, sortReverse, search } = req.query

  let aggregations = []

  // Search
  if (search) {
    aggregations.push({ $match: { $text: { $search: search } } })
  }

  // Sort
  if (sort === 'title') {
    aggregations.push({ $addFields: { lowerTitle: { $toLower: '$title' } } })
    aggregations.push({ $sort: { 'lowerTitle': sortReverse ? -1 : 1 } })
  } else if (sort === 'date') {
    aggregations.push({ $sort: { 'dateString': sortReverse ? 1 : -1 } })
  } else if (sort === 'stars') {
    aggregations.push({ $sort: { 'averageStars': sortReverse ? 1 : -1 } })
  } else {
    res.status(400).json({ error: "Query parameter 'sort' required to be one of 'title', 'date' or 'stars'" })
    return
  }

  // Skip, limit
  if (parseInt(perPage) > 0 && parseInt(page) > 0) {
    aggregations.push({ $skip: parseInt(perPage) * (parseInt(page) - 1) })
    aggregations.push({ $limit: parseInt(perPage) })
  } else {
    res.status(400).json({ error: "Query parameter 'perPage' and 'page' must be integers greater than zero" })
    return
  }

  // Exclude comments in scene list
  aggregations.push({ $project: { comments: false } })


  const client = await clientPromise

  // Create search index on 'text' and 'description' fields
  const result = await client
    .db('urcity2').collection('scenes')
    .createIndex({ title: 'text', description: 'text' }, { default_language: 'german' })

  const scenes = await client
    .db('urcity2').collection('scenes')
    .aggregate(aggregations).toArray()

  res.status(200).json(scenes)
}

async function handlePOST(req, res) {
  // Validate request body
  let scene = await object({
    screenshots: array().required().min(1).of(string().required().matches(/^data:image\/(png|jpeg);base64,/)),
    title: string().required(),
    description: string()
  }).noUnknown().validate(req.body)

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send('You need to be logged in')
    return
  }

  scene = {
    _id: uuidv4(),
    ...scene,
    account: session.account,
    user: session.user,
    dateString: new Date().toISOString(),
  }

  const client = await clientPromise

  await client
    .db('urcity2').collection('scenes')
    .insertOne(scene)

  res.status(200).json(scene)
}

export default async function handle(req, res) {
  if (req.method === 'POST') {
    await handlePOST(req, res)
  } else if (req.method === 'GET') {
    await handleGET(req, res)
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
