//importing types & utils

import { NextPage } from 'next';
//importing components
import Products from '../components/Products';
import ProductCarousel from '../components/ProductCarousel';
import Link from 'next/link';

const HomePage: NextPage = () => {
  return (
    <>
      
      <main className="wrapper py-5">
        <ProductCarousel />
        <Products/>
      </main>
    </>
  );
};

export default HomePage;
