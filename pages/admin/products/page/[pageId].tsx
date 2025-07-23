//importing types & utils
import { homeConfig } from '../../../../utils';
import { NextPage } from 'next';
//importing components
import SEO from '../../../../components/SEO';
import { useRouter } from 'next/router';
import ProductsList from '../../../../components/ProductsList';

const HomePage: NextPage = () => {
  const router = useRouter();
  const { pageId } = router.query;

  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 p-10"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <ProductsList pageId={pageId} />
      </main>
    </>
  );
};

export default HomePage;
