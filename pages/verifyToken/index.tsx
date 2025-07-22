import { NextPage } from 'next';
import VerifyToken from '../../components/VerifyToken';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';

const VerifyPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <VerifyToken />
      </main>
    </>
  );
};
export default VerifyPage;