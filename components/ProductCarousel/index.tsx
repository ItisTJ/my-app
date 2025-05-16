import React, { useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from 'react-bootstrap';
import Loader from '../Loader';
import Message from '../Message';
import { useSliderActions, useTypedSelector } from '../../hooks';
import { SliderInterface } from '../../interfaces'; // change the path if needed

//import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const ProductCarousel: React.FC = () => {
  const { fetchSliders } = useSliderActions();

  const { loading, error, data } = useTypedSelector((state) => {
    const sliderState = state.slider || { loading: false, error: null, data: [] };
    return {
      ...sliderState,
      data: sliderState.data as SliderInterface[],  // 👈 Tell TypeScript the type here
    };
  });
  

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);


  // Custom indicators - we'll use these via CSS instead of JSX to avoid syntax issues
  const renderCustomIndicator = () => {
    return null; // We'll handle this via CSS
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!data || data.length === 0) return <Message variant="info">No products available</Message>;

  return (
    <div className="w-full mx-auto p-24 bg-white ">
      <Carousel 
        pause="hover" 
        className="rounded-2g overflow-hidden"
        indicators={true}
      >
        {data.map((product: SliderInterface) => (
          <Carousel.Item key={product._id}>
            <div className="flex flex-col md:flex-row items-center h-96 md:h-128">
              {/* Product Image */}
              <div className="md:w-1/2 md:h-full overflow-hidden flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-contain max-h-full max-w-full transition-transform duration-700 hover:scale-105"
                />
              </div>
              
              {/* Product Info */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <div className="space-y-4 text-left">
            
                    <h2 className="text-4xl font-bold text-gray-800">{  product.name}</h2>
                  
                  <p className="text-2xl text-gray-600 line-clamp-3">{product.description}</p>

                    <button className='bg-black'>Show More</button>

                  <Link href={`/product/${product._id}`} passHref>
                  </Link>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      </div>
  );
};

export default ProductCarousel;
