import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import JobsPage from './pages/JobsPage'
import JobPage, { jobLoader } from './pages/JobPage'
import AddJobPage from './pages/AddJobPage'
import EditJobPage from './pages/EditJobPage'
import NotFoundPage from './pages/NotFoundPage'
import { toast } from 'react-toastify'
import { db } from './firebase'
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'

const App = () => {
  const reacting = async () => {
    // const docRef = await addDoc(collection(db, 'jobs'), newJob)
    const querySnapshot = await getDocs(collection(db, 'jobs'))
    const updatedJobs = querySnapshot.docs.map((doc) => doc.data())
    console.log(querySnapshot)
  }

  // add new job
  const addJob = async (newJob) => {
    // const response = await fetch('/api/jobs', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newJob),
    // })

    try {
      const docRef = await addDoc(collection(db, 'jobs'), newJob)
      const querySnapshot = await getDocs(collection(db, 'jobs'))
      const updatedJobs = querySnapshot.docs.map((doc) => doc.data())

      toast.success('Job added successfully')
    } catch (error) {
      console.error('Error adding job: ', error)
      toast.error('Failed to add job')
    }
  }

  // delete job
  const deleteJob = async (id) => {
    // const response = await fetch(`/api/jobs/${id}`, {
    //   method: 'DELETE',
    // })

    try {
      const jobRef = doc(db, 'jobs', id)
      await deleteDoc(jobRef)

      return toast.success('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job: ', error)
      toast.error('Failed to delete job')
    }
  }

  // update job
  const updateJob = async (job) => {
    // const response = await fetch(`/api/jobs/${job.id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(job),
    // })

    try {
      const jobRef = doc(db, 'jobs', job.id)
      await updateDoc(jobRef, job)

      return toast.success('Job updated successfully')
    } catch (error) {
      console.error('Error updating job: ', error)
      toast.error('Failed to edit job')
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='/jobs' element={<JobsPage />} />
        <Route
          path='/jobs/:id'
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        />
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path='/jobs-edit/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
      <button onClick={reacting}>Reacting</button>
    </>
  )
}

export default App
