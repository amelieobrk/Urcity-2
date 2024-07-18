import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Date from '../components/date'
import RatingStar from '../components/rating-star'
import { useState } from 'react'
import { useEffect, useMemo } from 'react'
import Pagination from '../components/general/pagination'
import clientPromise from '../lib/mongodb'
import debounce from 'lodash.debounce';

export async function getServerSideProps() {
  const client = await clientPromise

  const numScenes = await client
    .db('urcity2').collection('scenes')
    .countDocuments()

  return {
    props: {
      numScenes
    },
  }
}

export default function Home({ numScenes }) {
  const router = useRouter()
  const [scenes, setScenes] = useState([])
  const pageSize = 10; // Number of scenes per page

  // Query parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('date');
  const [sortReverse, setSortReverse] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/scenes?' + new URLSearchParams({
        perPage: pageSize,
        page: currentPage,
        sort: sort, // 'title', 'date' or 'stars'
        sortReverse: sortReverse ? 'non-empty string' : '',
        search: search,
      }))
      setScenes(await response.json())
    }
    fetchData()
  }, [currentPage, sortReverse, sort, search])

  function changeSort(newSort) {
    if (sort === newSort) {
      setSortReverse(!sortReverse)
    } else {
      setSort(newSort)
      setSortReverse(false)
    }
  }

  function changeSearch(newSearch) {
    setSearch(newSearch)
    setCurrentPage(1)
  }

  const debouncedChangeSearch = useMemo(
    () => debounce(changeSearch, 300)
    , []);

  return (
    <section className="bg-white dark:bg-gray-900 py-8">
      <Head><title>Szenenübersicht</title></Head>
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
          <input onChange={event => debouncedChangeSearch(event.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Suche" required />
        </div>

        <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-4">
          <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Screenshot
                </th>
                <th scope="col" className="py-3 px-6">
                  Autor
                </th>
                <th scope="col" className="py-3 px-6">
                  <a href="#" onClick={() => changeSort('title')}>
                    <div className="flex items-center">
                      Titel
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg>
                    </div>
                  </a>
                </th>
                <th scope="col" className="py-3 px-6">
                  <a href="#" onClick={() => changeSort('date')}>
                    <div className="flex items-center">
                      Erstellt
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg>
                    </div>
                  </a>
                </th>
                <th scope="col" className="py-3 px-6">
                  <a href="#" onClick={() => changeSort('stars')}>
                    <div className="flex items-center">
                      Bewertung
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg>
                    </div>
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                scenes
                  .map(scene => (
                    <tr key={scene._id} className="hover:bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer" onClick={() => router.push(`/scene/${scene._id}`)}>
                      <th scope="row" className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <Image className="rounded-lg aspect-video" src={scene.screenshots[0]} width={320} height={180} alt={scene.title} />
                      </th>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Image className="w-8 h-8 rounded-full" src={scene.user.image} width={64} height={64} alt={scene.user.name} />
                          <div className="text-sm text-gray-900 dark:text-white">{scene.user.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-900 dark:text-white">{scene.title}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Date dateString={scene.dateString} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center">
                          {scene.averageStars && (<div className="flex items-center">
                            <RatingStar className="w-5" on={scene.averageStars >= 0.5} />
                            <RatingStar className="w-5" on={scene.averageStars >= 1.5} />
                            <RatingStar className="w-5" on={scene.averageStars >= 2.5} />
                            <RatingStar className="w-5" on={scene.averageStars >= 3.5} />
                            <RatingStar className="w-5" on={scene.averageStars >= 4.5} />
                          </div>)}
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        <Pagination
          items={numScenes}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={page => setCurrentPage(page)} />
      </div>
    </section>
  )
} 
