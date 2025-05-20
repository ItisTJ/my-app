import { NextPage } from 'next';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';
import Services from '../../../components/Services/service';

const ServicesPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <Services />
      </main>
    </>
  );
};

export default ServicesPage;
