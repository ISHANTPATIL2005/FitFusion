import React from 'react'
import './App.css';
import { Routes,Route } from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import Signup from "../src/pages/Signup"
import Login from "../src/pages/Login"
import Otp from "../src/pages/otp"
//import Home from "../src/pages/Home"
import ProductDetails from "../src/pages/ProductDetails"
import Hero from "../src/pages/hero"
import Navbar from "../src/Common/Navbar"
import Footer from "../src/Common/Footer"
import Category from "../src/pages/Category"
import CartPage from "../src/Components/CartPage"
import About from "../src/pages/About"
import BuyProduct from './Components/BuyProduct';

function App() {
  return (
    <div className='bg-[#D6DAC8]'>
   <Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    style: {
      background: "#333",
      color: "#fff",
      fontSize: "16px",
      borderRadius: "12px",
      padding: "12px 20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
    success: {
      style: {
        background: "#4ade80", // green
        color: "#1f2937",
        fontWeight: "600",
      },
    },
    error: {
      style: {
        background: "#f87171", // red
        color: "#fff",
        fontWeight: "600",
      },
    },
  }}
/>
   <Navbar/>
<Routes>
  <Route path='/' element={<Hero/>}></Route>
  <Route path="/signup" element={<Signup/>}></Route>
  <Route path="/login" element={<Login/>}></Route>
  <Route path="/otp" element={<Otp/>}></Route>
  <Route path='/product/:id' element={<ProductDetails/>}></Route>
  <Route path="/category/:category" element={<Category />} />
  <Route path='/cartPage' element={<CartPage/>}></Route>
   <Route path='/About' element={<About/>}></Route>
   <Route path="/BuyProduct" element={<BuyProduct />} />

</Routes>
<Footer/>

    </div>
    
  )
}

export default App