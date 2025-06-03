import  { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'
function Navbar() {
  const navigate =  useNavigate();
  const { user,setUser } = useContext(UserContext)
  const handlelogout = async ()=>{
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/')
  }

  const handlelogin = ()=>{
    navigate('/login')
  }
  return (
    <div className="w-full h-[70px] bg-gradient-to-r from-blue-800 to-blue-900 shadow-md text-white flex items-center px-8">
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold tracking-wide">alistodo</h2>
      </div>

      <div className="flex-1 flex justify-center gap-8 text-sm md:text-base font-medium">
        <Link 
          to="/home" 
          className="hover:text-blue-300 transition duration-300"
        >
          Home
        </Link>
        <Link 
          to="/aboutus" 
          className="hover:text-blue-300 transition duration-300"
        >
          About Us
        </Link>
      </div>

      <div className="flex-1 flex justify-end">
        <h1 className="text-sm md:text-base font-semibold">
          {(!user || user.length === 0) ? (
            "Welcome User"
          ) : (
            `Welcome ${user}`
          )}
        </h1>
        {user ? (
          <button onClick={handlelogout } className='font-bold relative left-2 cursor-pointer'>
            Logout
          </button>
        ):(
          <button onClick={handlelogin} className='font-bold relative left-2 cursor-pointer'>
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
