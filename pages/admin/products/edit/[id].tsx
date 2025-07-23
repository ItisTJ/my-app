import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SEO from '../../../../components/SEO';
import { homeConfig } from '../../../../utils';
import ProductsEdit from '../../../../components/ProductsEdit';

const AdminUserEditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 p-10"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <ProductsEdit pageId={id} />
      </main>
    </>
  );
};
export default AdminUserEditPage;
