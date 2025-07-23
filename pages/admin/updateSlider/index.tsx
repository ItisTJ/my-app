import { NextPage } from 'next';
import CreateSliderProduct from '../../../components/CreateSliderProduct';
import SEO from '../../../components/SEO';
import { homeConfig } from '../../../utils';
import SliderList from '../../../components/SliderList';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="pt-40 p-10"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
        <SliderList />
        <br></br><br></br>
        <CreateSliderProduct />   
      </main>
    </>
  );
};
export default LoginPage;
