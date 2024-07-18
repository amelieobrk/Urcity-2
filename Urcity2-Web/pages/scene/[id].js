import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import clientPromise from '../../lib/mongodb'
import Comment from '../../components/comment'
import RatingStar from '../../components/rating-star'
import Head from 'next/head'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import Image from 'next/image'
import Date from '../../components/date'
import { useRouter } from 'next/router'
import Link from 'next/link'

export async function getServerSideProps({ req, res, params }) {
  const client = await clientPromise
  const session = await getServerSession(req, res, authOptions)

  const scene = await client
    .db('urcity2').collection('scenes')
    .findOne({ _id: params.id })

  if (scene === null) {
    return { notFound: true }
  }

  return {
    props: {
      scene,
      session,
    },
  }
}

export default function Scene({ scene }) {
  const { data: session } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rating, setRating] = useState(session && scene.ratings ? scene.ratings.find(rating => JSON.stringify(rating.account) === JSON.stringify(session.account)) : null)
  const [stars, setStars] = useState(rating ? rating.stars : 0)
  const [comment, setComment] = useState(rating ? rating.comment : '')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()
  
  async function rate({ stars, comment }) {
    const response = await fetch(`/api/scenes/${scene._id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stars: stars || (rating ? rating.stars : undefined),
        comment: comment || (rating ? rating.comment : undefined),
      }),
    })

    if (response.ok) {
      const rating = await response.json()

      // When we get a response update the rating.
      setRating(rating)
    }
  }

  async function deleteRating() {
    setStars(0)
    setComment('')

    const response = await fetch(`/api/scenes/${scene._id}/delete-rating`)

    if (response.ok) {
      // When we get a response update the rating.
      setRating(null)
    }
  }

  async function deleteScene() {
    const response = await fetch(`/api/scenes/${scene._id}/delete`)

    if (response.ok) {
      router.push('../')
    }
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 py-8">
        <Head><title>{scene.title}</title></Head>
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative w-full aspect-video mb-2">
            <Image className="rounded-lg" src={scene.screenshots[0]} fill alt={scene.title} />
          </div>
          <div className="flex flex-wrap items-center mb-4">
            <h2 className="text-xl font-bold mr-auto">{scene.title}</h2>
            {scene.averageStars && (<div className="flex items-center">
              <RatingStar className="w-5" on={scene.averageStars >= 0.5} />
              <RatingStar className="w-5" on={scene.averageStars >= 1.5} />
              <RatingStar className="w-5" on={scene.averageStars >= 2.5} />
              <RatingStar className="w-5" on={scene.averageStars >= 3.5} />
              <RatingStar className="w-5" on={scene.averageStars >= 4.5} />
              <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{scene.averageStars.toFixed(2)} von 5</p>
            </div>)}
          </div>
          <div className="flex items-center flex-wrap mb-4">
            <Image className="w-12 h-12 rounded-full mr-5" src={scene.user.image} width={64} height={64} alt={scene.user.name}></Image>
            <div className="text-sm text-gray-900 dark:text-white mr-auto">{scene.user.name} <p className="text-gray-500 dark:text-gray-400"><Date dateString={scene.dateString} /></p></div>
            <div className="flex flex-col">
            {session && JSON.stringify(scene.account) === JSON.stringify(session.account) && (
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Beitrag löschen
              </button>
            )}
          <div className="mt-4" >
          <Link href='/..'>
                 <button
                  type="button"
                  className="focus:outline-none text-gray-900 bg-white border border-gray-300 hover:bg-slate-700  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Zurück zur Startseite
                  </button>
                  </Link>
                  </div>
                  </div>
          </div>
   
          <p className="mb-8 text-gray-900 dark:text-white whitespace-pre-line">{scene.description}</p>

          {session &&
            (
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-6 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {rating ? 'Ändere deine Bewertung' : 'Hinterlasse eine Bewertung'}
              </button>
            )}

          {/* First, this accounts comment */}
          {(rating && rating.comment) && <Comment comment={rating} />}

          {/* Then, everyone else's comments */}
          {scene.ratings ? scene.ratings
            .filter(rating => rating.comment && (!session || JSON.stringify(rating.account) !== JSON.stringify(session.account)))
            .map(comment => (
              <Comment comment={comment} key={comment.account} />
            )) : null}
        </div>
      </section>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto grow max-w-md rounded shadow bg-white dark:bg-gray-700">
            <div className="py-6 px-6 lg:px-8">
              <Dialog.Title className="mb-4 text-xl text-gray-900 dark:text-white">Deine Bewertung</Dialog.Title>

              <div className="flex items-center mb-6">
                <RatingStar className="w-10" on={stars >= 1} onClick={() => { setStars(1); rate({ stars: 1 }) }} />
                <RatingStar className="w-10" on={stars >= 2} onClick={() => { setStars(2); rate({ stars: 2 }) }} />
                <RatingStar className="w-10" on={stars >= 3} onClick={() => { setStars(3); rate({ stars: 3 }) }} />
                <RatingStar className="w-10" on={stars >= 4} onClick={() => { setStars(4); rate({ stars: 4 }) }} />
                <RatingStar className="w-10" on={stars >= 5} onClick={() => { setStars(5); rate({ stars: 5 }) }} />
              </div>

              <label htmlFor="comment" className="block mb-2 text-sm text-gray-900 dark:text-white">Füge einen Kommentar hinzu</label>
              <textarea
                id="comment"
                value={comment} onChange={(ev) => setComment(ev.target.value)}
                placeholder="Was gefällt oder missfällt dir? Was kann man verbessern?"
                rows="4"
                className="block mb-6 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

              <div className="flex">
                <button
                  type="button"
                  disabled={!comment || !stars}
                  onClick={() => {
                    rate({ comment })
                    setDialogOpen(false)
                  }}
                  className="text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-blue-300">
                  Absenden
                </button>

                {rating &&
                  <button
                    type="button"
                    onClick={() => deleteRating()}
                    className="ml-auto text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    Bewertung Löschen
                  </button>
                }

              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto grow max-w-md rounded shadow bg-white dark:bg-gray-700">
            <div className="py-6 px-6 lg:px-8">
              <Dialog.Title className="mb-4 text-xl text-gray-900 dark:text-white">Möchtest du den Beitrag wirklich löschen?</Dialog.Title>
              <button
                type="button"
                onClick={deleteScene}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Beitrag löschen
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
