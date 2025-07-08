import SEO from '../../components/SEO';
import OrderDetails from '../../components/OrderDetails';
import { NextPage, GetServerSideProps } from 'next';
import { homeConfig } from '../../utils';

interface Props {
  orderId: string;
}

const OrderDetailsPage: NextPage<Props> = ({ orderId }) => {
  return (
    <>
      <SEO {...{ ...homeConfig, title: 'Order Details | Your Store', description: 'View your order details and tracking information' }} />
      <main className="wrapper py-5">
        <OrderDetails orderId={orderId} />
      </main>
    </>
  );
};

// This runs on server and passes orderId as prop to the page
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderid } = context.params!; // note lowercase 'orderid'

  return {
    props: {
      orderId: orderid as string, // pass it as 'orderId' prop to page
    },
  };
};


export default OrderDetailsPage;
