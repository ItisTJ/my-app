import React, { useEffect } from 'react';
import Link from 'next/link';
import { Carousel, Image } from 'react-bootstrap';
import Loader from '../Loader';
import Message from '../Message';
import { useSliderActions, useTypedSelector } from '../../hooks';

const ProductCarousel = () => {
  const { fetchSliders } = useSliderActions();

  const { loading, error, data } = useTypedSelector(
    state => state.slider || { loading: false, error: null, data: null }
  );

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : !data || data.length === 0 ? ( // Ensure data is not null before accessing length
    <Message variant="info">No products available</Message>
  ) : (
    <Carousel pause="hover" className="bg-blue-900">
      {data.map(_product => (
        <Carousel.Item key={_product._id}>
          <Image src={_product.image} alt={_product.name} fluid />
          <Link href={`/product/${_product._id}`} passHref>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {_product.name} ({_product.description})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
