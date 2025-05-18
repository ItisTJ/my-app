import { NextPage } from 'next';
import Register from '../../components/Register';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper">
        <Register />
      </main>
    </>
  );
};
export default LoginPage;
