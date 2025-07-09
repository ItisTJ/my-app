import SEO from '../../components/SEO';
import MyOrders from '../../components/MyOrders';
import { NextPage } from 'next';
import { homeConfig } from '../../utils';

const MyOrdersPage: NextPage = () => {
  return (
    <>
      <SEO {...{...homeConfig, title: 'Order Details | Your Store', description: 'View your order details and tracking information'}} />
      <main className="wrapper py-5">
        <MyOrders />
      </main>
    </>
  );
};

export default MyOrdersPage;
