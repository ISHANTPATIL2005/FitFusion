import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();
    const [allProduct, setAllProduct] = useState([]);

    useEffect(() => {
        const getAllProduct = async () => {
            try {
                const result = await axios.get(
                    "http://localhost:4000/api/v1/Product/getAllProduct",
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                setAllProduct(result.data.allproduct);
            } catch (error) {
                console.log(error);
            }
        };

        getAllProduct();
    }, []);

    const clickHandler = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="p-6  min-h-screen">


            {allProduct.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allProduct.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => clickHandler(product._id)}
                            className=" bg-gray-50  border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col items-center"
                        >
                            {product.image && (
                                <div className="w-full h-72 rounded-md mb-3 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                                    />
                                </div>

                            )}
                            <h3 className="text-lg font-semibold text-gray-800">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm">{product.brand}</p>
                            <p className="text-gray-800 font-bold mt-2">₹{product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
