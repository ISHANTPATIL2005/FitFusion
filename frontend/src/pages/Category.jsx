import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Category() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const result = await axios.get(
          "http://localhost:4000/api/v1/Product/getAllProduct",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const filtered = result.data.allproduct.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
        setProduct(filtered);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [category]);

  const clickHandler = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-6  min-h-screen bg-[#D6DAC8]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
       
      </h1>

      {product.length === 0 ? (
        <p className="text-gray-500">No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
              onClick={() => clickHandler(p._id)}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-72 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
              <p className="text-gray-600 text-sm">{p.brand}</p>
              <p className="text-gray-800 font-bold mt-2">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
