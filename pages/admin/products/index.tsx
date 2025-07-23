import { NextPage } from 'next';
import ProductsList from '../../../components/ProductsList';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';

const AdminProductsPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 p-10"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <ProductsList />
      </main>
    </>
  );
};
export default AdminProductsPage;
