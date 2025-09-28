import React from "react";
import Slider from "react-slick";
import { images } from "../Data/heroData";
import Home from "../pages/Home";

// ✅ required CSS imports for slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640, // mobile
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="w-full">
      <div className="px-6">
        <Slider {...settings}>
          {images.map((img) => (
            <div key={img.id}>
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-[500px] object-fill rounded-xl"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="mt-16">
        <Home />
      </div>
    </div>
  );
}

export default Hero;
