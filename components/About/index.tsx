import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import { FaInfoCircle, FaBullseye, FaRocket } from "react-icons/fa";

const AboutPage: React.FC = () => {
  const dispatch = useDispatch();

  const { loading, error, footerdata } = useTypedSelector((state) => ({
    loading: state.footer?.loading || false,
    error: state.footer?.error || null,
    footerdata: state.footer?.data || [],
  }));

  const footer = footerdata.length > 0 ? footerdata[0] : null;

  const [footerData, setFooterData] = useState({
    about: footer?.aboutUs || "",
    vision: footer?.vision || "",
    mission: footer?.mission || "",
  });

  useEffect(() => {
    if (!footerdata.length) {
      dispatch(fetchFooter());
    }
  }, [dispatch, footerdata.length]);

  useEffect(() => {
    if (footer) {
      setFooterData({
        about: footer.aboutUs || "",
        vision: footer.vision || "",
        mission: footer.mission || "",
      });
    }
  }, [footer]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-2xl shadow-2xl my-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center mt-6">
        Who We Are?
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3 flex items-center text-indigo-700">
              <FaInfoCircle className="mr-2 text-indigo-500" />
              About Us
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {footerData.about || "No information available."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3 flex items-center text-green-700">
              <FaBullseye className="mr-2 text-green-600" />
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {footerData.vision || "No vision provided."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 flex items-center text-blue-700">
              <FaRocket className="mr-2 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {footerData.mission || "No mission provided."}
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default AboutPage;
