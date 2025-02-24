import { NextPage } from 'next';
import CreateSliderProduct from '../../../components/CreateSliderProduct';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';
import SliderList from '../../../components/SliderList';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <SliderList />
        <br></br><br></br>
        <CreateSliderProduct />   
      </main>
    </>
  );
};
export default LoginPage;
