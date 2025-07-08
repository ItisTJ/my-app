import SEO from '../../components/SEO';
import OrderDetails from '../../components/OrderDetails';
import { NextPage } from 'next';
import { homeConfig } from '../../utils';

const OrderDetailsPage: NextPage = () => {
  return (
    <>
      <SEO {...{...homeConfig, title: 'Order Details | Your Store', description: 'View your order details and tracking information'}} />
      <main className="wrapper py-5">
        <OrderDetails />
      </main>
    </>
  );
};

export default OrderDetailsPage;