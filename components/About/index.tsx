import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";


const AboutPage: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state for header data
  const { loading, error, footerdata } = useTypedSelector((state) => ({
    loading: state.footer?.loading || false,
    error: state.footer?.error || null,
    footerdata: state.footer?.data || [],
  }));

  
  const footer = footerdata.length > 0 ? footerdata[0] : null;
    console.log("Footer Data (in About component):", footerdata);

    // Form state
  const [footerData, setFooterData] = useState({
    about: footer?.about || "",
  });

  // Fetch header data when component mounts
  useEffect(() => {
    if (!footerdata.length) {
      dispatch(fetchFooter());
    }
  }, [dispatch, footerdata.length]); // Avoid unnecessary re-fetching

  // Update form state when Redux data is loaded
  useEffect(() => {
    if (footer) {
      setFooterData({
        about: footer.aboutUs,
      });
    }
  }, [footer]);

  //


  // State to hold header settings (color & logo)
  const [footerSettings, setFooterSettings] = useState({
    about: footer?.about || "",
  });


  // Update header settings when `headerData` changes
  useEffect(() => {
    setFooterSettings({
      about: footerData.about,
    });
  }, [footerData]);

  return (
    <div className="h-screen p-5 bg-white rounded-lg shadow-lg my-5"> 
      <h1 className="text-3xl font-bold text-gray-800"><b>Who We are ? </b></h1>
      <p className="my-3 text-gray-600">{footerSettings.about}</p>
    </div>
  );
};

export default AboutPage;