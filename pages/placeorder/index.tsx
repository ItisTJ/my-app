import { NextPage } from 'next';
import PlaceOrder from '../../components/PlaceOrder/index';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const OrderPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5 mt-10">
        <PlaceOrder />
      </main>
    </>
  );
};
export default OrderPage;
