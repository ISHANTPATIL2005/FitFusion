import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom";
import { authContext } from "../context/context";
import axios from "axios";

function BuyProduct() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(authContext);

  const items = state?.items || [];
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/Product/getAddress?email=${auth.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setAddresses(res.data.addresses);
          if (res.data.addresses.length > 0) {
            setSelectedAddress(res.data.addresses[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (auth?.email) fetchAddresses();
  }, [auth?.email]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Place order
const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    return toast.error("Please select an address");
  }

  try {
    // 1. Place order
    const orderRes = await axios.post(
      "http://localhost:4000/api/v1/Product/placeorder",
      {
        email: auth.email,
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        addressId: selectedAddress._id,
        paymentMethod,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      }
    );

    if (orderRes.data.success) {
      // 2. Remove ordered items from cart
      for (const i of items) {
        try {
          const removeRes = await axios.post(
            "http://localhost:4000/api/v1/Product/removeFromCart",
            {
              email: auth.email,
              productId: i.product._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              withCredentials: true,
            }
          );

          if (removeRes.data.success) {
            console.log(`Removed ${i.product.name} from cart`);
          } else {
            console.warn("Failed to remove item:", removeRes.data.message);
          }
        } catch (err) {
          console.error("Error removing item from cart:", err);
        }
      }

      toast.success("✅ Order placed successfully!");
      navigate("/");
    } else {
      toast.error(orderRes.data.message || "Order not placed!");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    toast.error("❌ Order not placed!");
  }
};



  return (
    <div className="p-6 bg-[#D6DAC8] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="border p-4 mb-4 rounded-xl shadow-sm bg-[#9CAFAA] flex gap-4"
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">{item.product.name}</h2>
            <p>Qty: {item.quantity}</p>
            <p className="font-bold text-gray-800">
              ₹{item.product.price * item.quantity}
            </p>
          </div>
        </div>
      ))}

      {/* Address */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Address:</label>
        {addresses.length > 0 ? (
          <select
            value={selectedAddress?._id || ""}
            onChange={(e) =>
              setSelectedAddress(addresses.find((a) => a._id === e.target.value))
            }
            className="w-full border border-gray-300 rounded-lg p-3 mt-1 shadow-sm focus:ring-2  bg-[#9F9F9F] text-gray-700"
          >
            {addresses.map((element) => (
              <option key={element._id} value={element._id}>
                {element.street}, {element.city}, {element.country}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-red-600">No address found. Please add one.</p>
        )}
      </div>

      {/* Payment */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mt-1 shadow-sm bg-[#9F9F9F] text-gray-700"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="Card">Debit Card</option>
        </select>
      </div>

      {/* Total */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Total: ₹{totalAmount}
      </h2>

      <button
        onClick={handlePlaceOrder}
        className="w-40 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-800 transition font-semibold shadow-md"
      >
        Confirm Order
      </button>
    </div>
  );
}

export default BuyProduct;
