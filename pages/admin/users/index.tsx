import { NextPage } from 'next';
import SEO from '../../../components/SEO';
import UsersList from '../../../components/UsersList';
import { homeConfig } from '../../../utils';

const AdminUsersPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 pb-20"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <UsersList />
      </main>
    </>
  );
};
export default AdminUsersPage;
