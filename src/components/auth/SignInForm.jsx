import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { toast } from 'react-toastify'

const SignUpForm = () => {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()

    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword)

      setUserEmail('')
      setUserPassword('')
      navigate('/')
    } catch (error) {
      console.error(error)
      if (error.code = 'auth/invalid-credential') {
        toast.error('Invalid credentials')
      } else {
        toast.error('Network error')
      }
    }
  }

  const signInWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <h2 className='text-3xl text-center font-semibold mb-6'>Sign In</h2>

        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Enter email'
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-bold mb-2'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Enter password'
            required
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Sign In
          </button>

          <h3 className='text-1xl my-3 text-center'>OR</h3>
        </div>
      </form>

      <button
        type='button'
        className='text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2'
        onClick={signInWithGoogle}
      >
        <svg
          className='mr-2 -ml-1 w-4 h-4'
          aria-hidden='true'
          focusable='false'
          data-prefix='fab'
          data-icon='google'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 488 512'
        >
          <path
            fill='currentColor'
            d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
          ></path>
        </svg>
        Sign in with Google<div></div>
      </button>

      <h3 className='text-1xl my-3 text-center'>
        Don't have an account?{' '}
        <Link to='/sign-up' className='text-indigo-500'>
          Sign Up
        </Link>{' '}
        here.
      </h3>
    </>
  )
}

export default SignUpForm
