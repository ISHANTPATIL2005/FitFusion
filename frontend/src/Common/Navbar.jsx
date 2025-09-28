import React from 'react'
import { Navbarlinks } from '../Data/NavbarData'
import { Link } from 'react-router-dom'
import logo from "../Assets/logo2.jpg"
import Cart from '../Components/Cart'
import ProfileDropdown from './ProfileDropDown'

function Navbar() {
  return (
    <div className='flex justify-between items-center bg-[#FBF3D5]  text-gray-700 px-6 py-4'>
      
      {/* Left Side: Logo + Name */}
      <div className='flex items-center gap-3'>
        <img src={logo} alt="Logo" className="h-12 w-15 object-contain" />
        
      </div>

      {/* Right Side: Navigation Links */}
      <div className='flex gap-6 mr-48'>
        {Navbarlinks.map((element, index) => (
          <Link 
            key={index} 
            to={element.path} 
            className="hover:text-yellow-400 transition"
          >
            {element.title}
          </Link>
        ))}
      </div>
      
      <div className='flex flex-row items-center gap-8 mr-10'>
        <Cart/>
        <ProfileDropdown/>
     </div>
    </div>
  )
}

export default Navbar
