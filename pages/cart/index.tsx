import SEO from '../../components/SEO';
import Cart from '../../components/Cart';
import { NextPage } from 'next';
import { cartConfig } from '../../utils';

const CartPage: NextPage = () => {
  return (
    <>
      <SEO {...cartConfig} />
      <main className="wrapper py-5">
        <Cart />
      </main>
    </>
  );
};

export default CartPage;
