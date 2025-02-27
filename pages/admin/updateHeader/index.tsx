import { NextPage } from 'next';
import CreateHeader from '../../../components/CreateHeader';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <CreateHeader />   
      </main>
    </>
  );
};
export default LoginPage;