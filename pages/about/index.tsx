import { useEffect } from "react";
import AboutPage from "../../components/About";


const About: React.FC = () => {
    useEffect(() => {
        document.title = "About Us | My Website";
      }, []);
  return (
    <>
      <AboutPage />
    </>
  );
};

export default About;