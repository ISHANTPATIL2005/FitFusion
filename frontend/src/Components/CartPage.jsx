import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../context/context";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const { auth,setCartUpdated ,CartUpdated} = useContext(authContext);

  useEffect(() => {
    const getCart = async () => {
      try {
        if (!auth?.email) {
          console.log("No email, user not logged in");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/v1/Product/getCart?email=${auth.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );


        console.log("cart:", res.data.cart);
        setCart(res.data.cart?.items || []);
      // setCartUpdated((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    };

    getCart();
  }, [auth?.email, auth?.token]);

  const removehande = async (productId) => {
    try {
      const remove = await axios.post('http://localhost:4000/api/v1/Product/removeFromCart',
        {
          email: auth.email,
          productId: productId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )
          toast.error("Removed from Cart"); 
      setCartUpdated((prev) => !prev);

    }
    catch (error) {
      console.log(error);
    }
  }

  const clickHandler = (product, quantity) => {
    navigate("/BuyProduct", {
      state: { items: [{ product, quantity }] }, // always array
    });
  };
  const handleBuyAll = () => {
    const items = cart.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));
    navigate("/BuyProduct", { state: { items } });
  };


  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#1C352D]">Hurry Up!...</h1>

      {!auth?.email ? (
        <div className="flex items-center justify-center flex-col h-64 gap-y-10">
          <p>Nothing is Here</p>
          <Link to={"/login"}>
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">
              Explore More
            </button>
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item, index) => {
            const product = item?.productId; // ✅ safe check
            if (!product) {
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-md ml-10 mb-3 bg-gray-200 text-gray-600"
                >
                  Product no longer available
                </div>
              );
            }

            return (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md ml-10 mb-3 flex items-center gap-4 justify-start gap-x-20 bg-[#9CAFAA]"
              >
                {/* Product Image */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}

                {/* Product Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {product.name || "Unknown Product"}
                  </h2>
                  <p className="text-gray-500">{product.brand}</p>
                  <p className="text-sm">{product.description}</p>
                  <p className="font-bold mt-1">₹{product.price}</p>
                </div>

                {/* Right Section */}
                <div className="text-right items-start justify-center">
                  <div className="mr-5">
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-md font-semibold text-green-600">
                      Total: ₹{product.price * item.quantity}
                    </p>
                  </div>

                  {/* Buy Button */}
                  <div className="
                 flex flex-col items-center justify-center gap-3">
                    <button
                      //remove Button
                      onClick={() => removehande(product._id)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove Item
                    </button>

                    <button
                      onClick={() => clickHandler(product, item.quantity)}
                      className="mt-2 px-7 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Buy Now
                    </button>


                  </div>

                </div>
              </div>
            );

          })}

          {/* Buy All Button */}
          <div className="mt-6 flex justify-center ">
            <button
              onClick={handleBuyAll}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
            >
              Buy All
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
