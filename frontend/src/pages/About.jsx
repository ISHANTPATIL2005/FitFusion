import React, { useState, useEffect } from "react";
import Banner from "../Assets/about3.jpg";
//import image1 from "../Assets/about1.jpg";
import image2 from "../Assets/about2.jpg";
import axios from "axios";

function About() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const getReviews = async () => {
            try {
                const result = await axios.get(
                    "http://localhost:4000/api/v1/Product/allReating",
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                setReviews(result.data.allReview);
                console.log(result.data.allReview); // ✅ log actual data
            } catch (error) {
                console.log(error);
            }
        };
        getReviews();
    }, []);

    // Function to display stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const num = parseInt(rating); // convert string to number
        for (let i = 0; i < 5; i++) {
            if (i < num) stars.push("★");
            else stars.push("☆");
        }
        return stars.join("");
    };
   

    return (
        <div>
            {/* Banner */}
            <div>
                <img src={Banner} alt="Banner" className="w-full shadow-emerald-50" />
            </div>

            {/* Description */}
            <p className="text-lg text-gray-800 text-center items-center mt-10">
                Our Heritage Collection brings together tradition and modern style,
                celebrating <br />
                the rich craftsmanship of India. From festive Eid collections for women
                to sophisticated engagement <br />
                attire for men, every piece is designed with intricate detailing and
                premium fabrics to make every occasion special.
            </p>

            {/* About Images & Text */}
            <div className="flex flex-row items-center mt-10 justify-center gap-10">
                <img
                    src={image2}
                    alt="about"
                    className="w-1/2 h-auto object-cover"
                />
                <div>
                    <ul className="text-md font-semibold text-gray-800">
                        <li>Elegant kurtas and sarees in pastel and vibrant shades.</li>
                        <li>Handcrafted embroidery and delicate patterns.</li>
                        <li>Comfortable, stylish, and perfect for celebrations.</li>
                    </ul>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10">
                <h2 className="text-3xl font-bold text-center text-[#1C352D] mb-5">
                    See What Our Customers Say About us...
                </h2>
                <div className="flex flex-row items-center gap-8">
                    {reviews.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#EDA35A] flex flex-col justify-between items-center text-center 
             p-6 border rounded-xl shadow-lg w-72 h-64 transition-transform 
             hover:scale-105 hover:shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900">
                                {item.User?.firstName} {item.User?.lastName}
                            </h3>

                            <p className="text-base text-gray-700 mt-3 line-clamp-3">
                                {item.review}
                            </p>

                            <p className="text-lg text-gray-800 mt-3 font-medium">
                                Rating: {renderStars(item.reating)}
                            </p>

                            <p className="text-sm text-gray-600 mt-2 italic">
                                Product: {item.Product?.name}
                            </p>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;
