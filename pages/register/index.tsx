import { NextPage } from 'next';
import Register from '../../components/Register';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 pb-20"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <Register />
      </main>
    </>
  );
};
export default LoginPage;
