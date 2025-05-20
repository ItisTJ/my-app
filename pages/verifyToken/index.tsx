import { NextPage } from 'next';
import VerifyToken from '../../components/VerifyToken';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const VerifyPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper">
        <VerifyToken />
      </main>
    </>
  );
};
export default VerifyPage;