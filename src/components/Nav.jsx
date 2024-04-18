import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import logo from '../assets/images/logo.png'
import avatar from '../assets/images/avatar.png'

const Nav = ({ checkUser, userInfo }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'

  return (
    <nav className='bg-indigo-700 border-b border-indigo-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
              <img className='h-10 w-auto' src={logo} alt='React Jobs' />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                React Jobs
              </span>
            </NavLink>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <NavLink to='/' className={linkClass}>
                  Home
                </NavLink>
                <NavLink to='/jobs' className={linkClass}>
                  Jobs
                </NavLink>
                {checkUser && (
                  <NavLink to='/add-job' className={linkClass}>
                    Add Job
                  </NavLink>
                )}
                {!checkUser ? (
                  <NavLink to='/sign-in' className={linkClass}>
                    Sign In
                  </NavLink>
                ) : (
                  <>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={
                        userInfo.photoURL === null ? avatar : userInfo.photoURL
                      }
                      alt='avatar'
                    />
                    <button
                      className='text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Nav
