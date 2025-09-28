import React, { useState } from "react";
import OTPInput from "react-otp-input";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function OTPPage() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const handleChange = (value) => {
        setOtp(value);
    };

    const handleVerify = async () => {
        try {
            const res = await axios.post("http://localhost:4000/api/v1/user/checkOtp", { otp },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
          
            navigate("/login");
        } 
        catch (err) {
            console.error(err);
            alert("OTP verification failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  px-4">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Enter OTP</h1>
            <p className="text-gray-500 mb-6 text-center max-w-md">
               Plese enter the OTP sent to your registered email address.
            </p>

            {/* OTP Input */}
            <OTPInput
                value={otp}
                onChange={handleChange}
                numInputs={6}
                renderSeparator={<span className="mx-2 text-gray-500">-</span>}
                renderInput={(props) => (
                    <input
                        {...props}
                        className="border border-gray-300 rounded-lg w-24 h-8 text-center text-lg 
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                                   placeholder-gray-400 shadow-sm"
                        placeholder="-"
                    />
                )}
            />

            {/* Verify Button */}
            <button
                onClick={handleVerify}
                className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg 
                           hover:bg-red-700 transition duration-300 shadow-md"
            >
                Verify OTP
            </button>
            
        </div>
    );
}
