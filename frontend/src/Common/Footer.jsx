import React from 'react'
import {footerLinks} from "../Data/fotreData"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


function Footer() {
  return (
    <div className=' h-80 bg-[#9CAFAA]'>
        <div className=' flex flex-row mt-10 p-y-8 items-center justify-center gap-x-32 '>
         {footerLinks.map((element, index) => (
                <div className="flex flex-col items-start min-w-[150px]" key={index}>
                    <h3 className="text-white font-bold mb-2">{element.title}</h3>
                    <ul className="space-y-1">
                        {element.links.map((link, linkIndex) => (
                            <li key={linkIndex} className="hover:text-white cursor-pointer">
                                {link}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
    </div>
    <div className=' flex flex-row p-y-5 justify-between mt-9'>
         <h3 className="font-inter font-bold text-yellow-100 ml-10">Made by Ishant Patil 🗿 © 2K25</h3>
         <div className="flex gap-4 text-richblack-300 mr-20 ">
                    <a href="https://facebook.com" className="hover:text-white"><FaFacebookF /></a>
                    <a href="https://twitter.com" className="hover:text-white"><FaTwitter /></a>
                    <a href="https://instagram.com" className="hover:text-white"><FaInstagram /></a>
                    <a href="https://linkedin.com" className="hover:text-white"><FaLinkedinIn /></a>
                </div>

    </div>

    </div>
  )
}

export default Footer