import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import { useParams } from "react-router-dom";
import { authContext } from "../context/context";

function ProductDetails() {
  const { auth ,setCartUpdated} = useContext(authContext);
  const { id } = useParams();
  console.log("Product ID:", id);

  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Get Product
        const productRes = await axios.get(
          `http://localhost:4000/api/v1/Product/getProductById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setProduct(productRes.data.product);
        toast.success("Shop Now")


        // ✅ Get Ratings/Reviews for this product
        const ratingRes = await axios.get(
          `http://localhost:4000/api/v1/Product/getRatingAndReviewById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setRatings(ratingRes.data.ratings || []);
        console.log("Ratings:", ratingRes.data.ratings);
        console.log("ratingID", ratingRes.data.ratingsId);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Add to Cart Handler
  const clickHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/Product/addToProduct",
        {
          email: localStorage.getItem("email"),
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          withCredentials: true,
        }
      );
      

      console.log(res.data);
      toast.success("Added to Cart");
    setCartUpdated(prev => !prev); 
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-8 p-6 mx-10 bg-[#C9CDCF] rounded-lg text-gray-800 mt-10">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-[350px] h-[490px] rounded-lg shadow-md object-cover border border-gray-200"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col rounded-lg shadow-inner shadow-white flex-1">
        <div className="ml-16 mt-10">
          <h3 className="text-3xl font-bold text-[#1C352D]">{product.name}</h3>
          <h2 className="text-xl font-medium text-gray-700">{product.brand}</h2>
          <p className="text-lg font-semibold text-gray-600">₹{product.price}</p>
          <p className="text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>
          <p className="text-base text-gray-500">
            In stock: {product.countInStock}
          </p>

          {/* Add to Cart */}
          <div
            className="mt-16 flex flex-row items-center justify-center w-40 h-12 bg-red-600 text-white text-lg font-bold rounded-md hover:bg-red-800 transition-colors duration-200 cursor-pointer"
            onClick={clickHandler}
          >
            Add To Cart
          </div>
          
        </div>
          {/* Ratings & Reviews */}
      <div className="mt-10 w-full md:w-1/3  md:mt-0  p-4 rounded-lg ">
        <h3 className="text-2xl font-bold mb-4 text-[#1C352D]">Ratings & Reviews</h3>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="ml-10 space-y-4">
            {ratings.map((r, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg shadow-sm"
              >
                <p className="font-semibold text-gray-800">
                  ⭐ {r.rating} / 5
                </p>
                <p className="text-gray-600">{r.review}</p>
                <p className="text-sm text-gray-400">
                  By: {r.user?.name || "Anonymous"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

    
    </div>
  );
}

export default ProductDetails;
