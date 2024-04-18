import { useState, useEffect } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useNavigate,
} from 'react-router-dom'
import { db } from './firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import JobsPage from './pages/JobsPage'
import JobPage, { jobLoader } from './pages/JobPage'
import AddJobPage from './pages/AddJobPage'
import EditJobPage from './pages/EditJobPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  const [checkUser, setCheckUser] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCheckUser(true)
        setUserInfo(user)
      } else {
        setCheckUser(false)
      }
    })

    return () => unsubscribe()
  }, [auth])

  const AuthRedirect = ({ element, condition }) => {
    const navigate = useNavigate()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && condition) {
          navigate('/', { replace: true })
        } else if (!user && !condition) {
          navigate('/sign-in', { replace: true })
        }
      })

      return () => unsubscribe()
    }, [auth, navigate, condition])

    // Render the provided element regardless of user authentication status
    return element
  }

  // add new job
  const addJob = async (newJob) => {
    try {
      await addDoc(collection(db, 'jobs'), newJob)

      toast.success('Job added successfully')
    } catch (error) {
      console.error('Error adding job: ', error)
      toast.error('Failed to add job')
    }
  }

  // update job
  const updateJob = async (job) => {
    try {
      const jobRef = doc(db, 'jobs', job.id)
      await updateDoc(jobRef, job)

      return toast.success('Job updated successfully')
    } catch (error) {
      console.error('Error updating job: ', error)
      toast.error('Failed to edit job')
    }
  }

  // delete job
  const deleteJob = async (id) => {
    try {
      const jobRef = doc(db, 'jobs', id)
      await deleteDoc(jobRef)

      return toast.success('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job: ', error)
      toast.error('Failed to delete job')
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path='/'
        element={<MainLayout checkUser={checkUser} userInfo={userInfo} />}
      >
        <Route index element={<Home />} />
        <Route path='/jobs' element={<JobsPage />} />
        <Route
          path='/jobs/:id'
          element={<JobPage deleteJob={deleteJob} checkUser={checkUser} />}
          loader={jobLoader}
        />
        <Route
          path='/add-job'
          element={
            <AuthRedirect
              element={<AddJobPage addJobSubmit={addJob} />}
              condition={false}
            />
          }
        />
        <Route
          path='/jobs-edit/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route
          path='/sign-in'
          element={<AuthRedirect element={<AuthPage />} condition={true} />}
        />
        <Route
          path='/sign-up'
          element={<AuthRedirect element={<AuthPage />} condition={true} />}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
