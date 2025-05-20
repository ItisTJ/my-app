//importing styles
import '../styles/index.css';
import '../styles/bootstrap.min.css';
//importing utils
import { useStore } from '../state/store';
import type { AppProps } from 'next/app';
//importing components
import MainLayout from '../layouts/MainLayout';
//import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';

import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";



function MyApp({ Component, pageProps }: AppProps) {
  const initialState = {
    ...pageProps.initialReduxState,
  };

  const store = useStore(initialState);

  return (
    <Provider store={store}>
      <MainLayout>
        
          <Component {...pageProps} />
        
      </MainLayout>
    </Provider>
  );
}

export default MyApp;
