import { NextPage } from 'next';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';
import PrivacyPolicy from '../../../components/PrivacyPolicy/privacyPolicy';

const PrivacyPolicyPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <PrivacyPolicy />
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
