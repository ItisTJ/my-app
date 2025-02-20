import { NextPage } from 'next';
import CreateSliderProduct from '../../../components/CreateSliderProduct';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <CreateSliderProduct />
      </main>
    </>
  );
};
export default LoginPage;
