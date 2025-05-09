import { NextPage } from 'next';
import { CreditOrder, PayPalOrder, CashOrder } from '../../components/PlaceOrder';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';
import { useTypedSelector } from '../../hooks';

const OrderPage: NextPage = () => {
  const { cart } = useTypedSelector((state) => state);

  // Mapping the payment method to the appropriate component
  const PaymentComponent = {
    CreditCard: CreditOrder,
    PayPal: PayPalOrder,
    Cash: CashOrder
  }[cart.data.paymentMethod] || PayPalOrder; // Default to PayPalOrder if not found

  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <PaymentComponent />
      </main>
    </>
  );
};

export default OrderPage;

