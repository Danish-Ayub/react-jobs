import { useState, useEffect } from 'react'
import Listing from './Listing'
import Spinner from './Spinner'
import { db } from '../firebase'
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore'

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (isHome) {
          const q = query(collection(db, 'jobs'), limit(3))
          const querySnapshotLimit = await getDocs(q)
          const latestJobs = querySnapshotLimit.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setJobs(latestJobs)
        } else {
          const q = query(collection(db, 'jobs'))
          const querySnapshotLimit = await getDocs(q)
          const latestJobs = querySnapshotLimit.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setJobs(latestJobs)
        }
      } catch (error) {
        console.error('Error fetching jobs: ', error)
        // return [] // Return an empty array in case of error
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {jobs.map((job) => {
                return <Listing key={job.id} job={job} />
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default JobListings
