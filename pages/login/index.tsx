import { NextPage } from 'next';
import Login from '../../components/Login';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <Login />
      </main>
    </>
  );
};
export default LoginPage;
