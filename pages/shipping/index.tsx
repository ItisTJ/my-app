import { NextPage } from 'next';
import SEO from '../../components/SEO';
import Shipping from '../../components/Shipping';
import { shippingConfig } from '../../utils';

const ShippingPage: NextPage = () => {
  return (
    <>
      <SEO {...shippingConfig} />
      <main className="wrapper mt-20">
        <Shipping />
      </main>
    </>
  );
};
export default ShippingPage;
