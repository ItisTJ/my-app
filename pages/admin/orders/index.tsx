import { NextPage } from 'next';
import OrdersList from '../../../components/OrdersList';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const OrderPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-20 p-10"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <OrdersList />
      </main>
    </>
  );
};
export default OrderPage;
