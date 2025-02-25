import { NextPage } from 'next';
import CreateFooterProduct from '../../../components/CreateFooterProduct';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <br></br><br></br>
        <CreateFooterProduct />   
      </main>
    </>
  );
};
export default LoginPage;