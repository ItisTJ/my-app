//importing types & utils

import { NextPage } from 'next';
//importing components
import Products from '../components/Products';
import ProductCarousel from '../components/ProductCarousel';  
import Banner from '../components/Banner';

const HomePage: NextPage = () => {
  return (
    <>
      
      <main className="wrapper">
        <ProductCarousel />
        <Banner/>
        <Products/>
      </main>
    </>
  );
};

export default HomePage;
