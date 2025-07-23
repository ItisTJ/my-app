import { NextPage } from 'next';
import CreateHeader from '../../../components/CreateHeader';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <CreateHeader />   
      </main>
    </>
  );
};
export default LoginPage;