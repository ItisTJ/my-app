import { NextPage } from 'next';
import Profile from '../../components/Profile';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <Profile />
      </main>
    </>
  );
};
export default LoginPage;
