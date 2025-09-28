import React, { useState, useEffect, useContext } from 'react';
import { IoCart } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { authContext } from '../context/context';

function Cart() {
    const navigate = useNavigate();
      const {auth,cartUpdated}=useContext(authContext)
  const [quantity, setquantity] = useState(0);


 useEffect(() => {
  const fetchCart = async () => {
    try {
      if(!auth.email){
       setquantity(0)
       return;
      }
      const email = localStorage.getItem("email");
      if (!email) {
        console.log("User not logged in");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/v1/Product/getCart?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Cart API Response:", response.data);

      if (response.data.cart && response.data.cart.items) {
        setquantity(response.data.cart.items.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchCart();
},  [auth.email, cartUpdated]);


  return (
    <div className="relative inline-block">
      <IoCart className="text-4xl text-gray-700" onClick={()=>{navigate("/cartPage")}}/>

      {/* Show badge only if quantity > 0 */}
      {quantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
          {quantity}
        </span>
      )}
    </div>
  );
}

export default Cart;
