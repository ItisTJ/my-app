import SEO from '../../components/SEO';
import Cart from '../../components/Cart';
import { NextPage } from 'next';
import { homeConfig } from '../../utils';

const CartPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5 mt-10">
        <Cart />
      </main>
    </>
  );
};

export default CartPage;
