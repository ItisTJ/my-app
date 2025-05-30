import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCarousel from '../components/ProductCarousel';
import {
  useCartActions,
  useLocalStorage,
  useReset,
  useUserActions,
} from '../hooks';
import { useEffect } from 'react';

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useReset();

  const accessToken = useLocalStorage('', 'accessToken');

  const { getCurrentUser } = useUserActions();
  const { getCart } = useCartActions();

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (accessToken.length > 0) {
      getCurrentUser(accessToken);
    }
  }, [accessToken, getCurrentUser]);

  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
