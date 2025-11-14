
import { useRouter } from 'next/router';
import OrderDetails from '../../components/OrderDetails';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <OrderDetails orderId={id as string} />;
};

export default OrderDetailsPage;