import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '../Loader';
import Message from '../Message';
import { useSliderActions, useTypedSelector } from '../../hooks';
import { SliderInterface } from '../../interfaces';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaAngleDown } from 'react-icons/fa6';

const ProductCarousel: React.FC = () => {
  const { fetchSliders } = useSliderActions();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { loading, error, data } = useTypedSelector((state) => {
    const sliderState = state.slider || { loading: false, error: null, data: [] };
    return {
      ...sliderState,
      data: sliderState.data as SliderInterface[],
    };
  });

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // Handle navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentSlide, data]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!data || data.length === 0) return <Message variant="info">No products available</Message>;

  return (
    
<<<<<<< HEAD
    <div className="w-full mx-auto p-6 mb-8 md:p-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 relative">
      
      {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute ml-5 top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow text-gray-800"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute mr-5 top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow text-gray-800"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>


      <div className=" overflow-hidden rounded-lg h-96 md:h-150">
=======
    <div className=" flex w-full min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 p-4 sm:p-6 md:p-12 z-0 relative">
      <div className="relative overflow-hidden rounded-lg h-auto max-w-full mx-auto sm:max-w-4xl lg:w-full lg:max-w-none">
>>>>>>> tjsBranch
        {/* Slides container */}
        <div 
          className="flex transition-transform duration-500 ease-out h-auto "
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {data.map((product: SliderInterface) => (
            <div key={product._id} className="w-full flex-shrink-0 flex flex-col sm:flex-row items-center">
              {/* Product Image */}
              <div className="w-full sm:w-1/2 h-[50vh] sm:h-[60vh] md:h-[90vh] overflow-hidden flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-contain w-[90%] h-[90%] max-h-full max-w-full transition-transform duration-700 hover:scale-105 "
                />
              </div>
              
              {/* Product Info */}
<<<<<<< HEAD
              <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center">
                <div className="space-y-4 text-left">
                  <h2 className="text-1xl md:text-4xl font-bold text-gray-800">{product.name}</h2>
                  <p className="text-lg md:text-1xl text-gray-600 line-clamp-3">{product.description}</p>
                  <Link href={`/components/Products`} passHref>
                    <button className="mt-4 bg-black text-white px-6 py-2 rounded-3xl hover:bg-blue-600">
                      Show More
=======
              <div className="w-full sm:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col align-center justify-content-center items-center">
                <div className="space-y-3 text-left">
                  <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h2>
                  <p className="font-sans text-base sm:text-lg md:text-lg lg:text-xl text-gray-600 line-clamp-3 mb-24">{product.description}</p>
                  <Link href={`/product/${product._id}`} passHref>
                    <button className="mt-12 sm:mt-4 bg-none text-gray-800 hover:text-white px-4 sm:px-6 py-2 rounded-3xl hover:bg-gray-800 transition-colors text-sm sm:text-base border-2 border-gray-800 bodrer-solid group">
                      Show More <FaAngleDown className="inline-block ml-2 animate-bounce hover:color-white " />
>>>>>>> tjsBranch
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
=======
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-1 sm:p-2 rounded-full shadow text-gray-800"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-1 sm:p-2 rounded-full shadow text-gray-800"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
>>>>>>> tjsBranch
          {data.map((_: SliderInterface, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-black w-4 sm:w-6' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;