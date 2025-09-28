import React, { useState, useRef, useEffect, useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { authContext } from "../context/context";
import { IoLocation } from "react-icons/io5";
import { CiLogout, CiLogin } from "react-icons/ci";
import axios from "axios"

export default function ProfileDropdown() {
  const { auth, setAuth } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    street: auth?.address?.street || "",
    city: auth?.address?.city || "",
    postalCode: auth?.address?.postalCode || "",
    country: auth?.address?.country || "",
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setAuth({ email: null, token: null, address: null });
   // alert("Logout successful");
    setIsOpen(false);
  };

  // ✅ Save address
  const saveAddress = async (e) => {
    e.preventDefault();
    setAuth((prev) => ({ ...prev, address: formData }));
    try {
      const responce = await axios.post('http://localhost:4000/api/v1/Product/setAdderss',
        formData ,
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          withCredentials: true,
        }
      )
      alert("Address saved successfully!");
    }
    catch (error) {
      console.error("Error saving address:", error);
    }


    setShowForm(false);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Icon */}
      <CgProfile
        className="text-3xl cursor-pointer hover:text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <ul className="py-1">
            {!auth?.email && (
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex flex-row items-center gap-1"
                  onClick={() => setIsOpen(false)}
                >
                  <CiLogin />
                  Login
                </Link>
              </li>
            )}

            {auth?.email && (
              <>
                <li>
                  <button
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex flex-row items-center gap-1"
                    onClick={() => setShowForm(true)}
                  >
                    <IoLocation />
                    Add Location
                  </button>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex flex-row items-center gap-1"
                  >
                    <CiLogout />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* ✅ Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Set Address</h2>
            <form onSubmit={saveAddress} className="flex flex-col gap-3">
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="border rounded-lg p-2 w-full"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
