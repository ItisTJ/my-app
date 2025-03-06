import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";

const Footer: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state for header data
  const { loading, error, footerdata } = useTypedSelector((state) => ({
    loading: state.footer?.loading || false,
    error: state.footer?.error || null,
    footerdata: state.footer?.data || [],
  }));

  // Ensure `header` is correctly extracted from `headerdata`
  const footer = footerdata.length > 0 ? footerdata[0] : null;
  console.log("Footer Data (in Footer component):", footerdata);

  // Form state
  const [footerData, setFooterData] = useState({
    contactNumber: footer?.contactNumber || "",
    email: footer?.email || "",
    aboutUs: footer?.aboutUs || "",
    fbLink: footer?.fbLink || "",
    whatsappLink: footer?.whatsappLink || "",
    instaLink: footer?.instaLink || "",
    ytLink: footer?.ytLink || "",
    ttLink: footer?.ttLink || "",
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
        contactNumber: footer.contactNumber,
        email: footer.email,
        aboutUs: footer.aboutUs,
        fbLink: footer.fbLink,
        whatsappLink: footer.whatsappLink,
        instaLink: footer.instaLink,
        ytLink: footer.ytLink,
        ttLink: footer.ttLink,
      });
    }
  }, [footer]);


  // State to hold header settings (color & logo)
  const [footerSettings, setFooterSettings] = useState({
    contactNumber: footerData.contactNumber || "",
    email: footerData.email || "",
    aboutUs: footerData.aboutUs || "",
    fbLink: footerData.fbLink || "",
    whatsappLink: footerData.whatsappLink || "",
    instaLink: footerData.instaLink || "",
    ytLink: footerData.ytLink || "",
    ttLink: footerData.ttLink || "",
  });


  // Update header settings when `headerData` changes
  useEffect(() => {
    setFooterSettings({
      contactNumber: footerData.contactNumber || "",
      email: footerData.email || "",
      aboutUs: footerData.aboutUs || "",
      fbLink: footerData.fbLink || "",
      whatsappLink: footerData.whatsappLink || "",
      instaLink: footerData.instaLink || "",
      ytLink: footerData.ytLink || "",
      ttLink: footerData.ttLink || "",
    });
  }, [footerData]);

  // Simulated MongoDB Fetched Data
  const data = {
    branches: [
      {
        branchName: "Rathnapura",
        image: "/images/image.png",
        contact: "+94 71 234 5678",
        openHours: "10 AM - 4 PM",
      },
      {
        branchName: "Colombo",
        image: "/images/image.png",
        contact: "+94 71 876 5432",
        openHours: "9 AM - 5 PM",
      },
      {
        branchName: "Kandy",
        image: "/images/image.png",
        contact: "+94 71 345 6789",
        openHours: "9 AM - 6 PM",
      },
    ],
    aboutUs: footerSettings.aboutUs || "",
    services: [
      {
        serviceName: "Web Development",
        image: "/images/service1.png",
        description: "We provide modern and responsive web development solutions.",
      },
      {
        serviceName: "SEO Optimization",
        image: "/images/service2.png",
        description: "Improve your website's ranking with our expert SEO services.",
      },
    ],
    privacyAndPolicies: [
      {
        title: "Terms of Service",
        description: "Our terms of service govern your use of our platform.",
      },
      {
        title: "Privacy Policy",
        description: "Learn how we handle your personal data securely.",
      },
      {
        title: "Delivery policies",
        description: "Details about our delivery procedures and policies.",
      },
    ],
    contactNumber: footerSettings.contactNumber || "",
    email: footerSettings.email || "",
    fbLink: footerSettings.fbLink || "",
    whatsappLink: footerSettings.whatsappLink || "",
    instaLink: footerSettings.instaLink || "",
    ytLink: footerSettings.ytLink || "",
    ttLink: footerSettings.ttLink || "",
  };

  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-start gap-6 text-left">
        {/* Branches Section */}
        <div className="w-full border-b border-gray-700 pb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Branches</h3>
          <div className="overflow-x-auto custom-scrollbar">
            <div className="flex gap-6 min-w-max">
              {data.branches.map((branch, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-gray-800 p-4 rounded-lg shadow-lg min-w-[200px]">
                  <h4 className="text-white">{branch.branchName}</h4>
                  <div className="flex justify-center">
                    <Image src={branch.image} alt={branch.branchName} width={150} height={60} />
                  </div>
                  <br />
                  <p className="text-xs text-blue-200">
                    <i className="fas fa-phone-alt"></i> {branch.contact}
                  </p>
                  <p className="text-xs text-green-200">
                    <i className="fas fa-clock"></i> Open At: {branch.openHours}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex-4 min-w-[240px]">
          <Link href={data.aboutUs} className="font-bold text-white transition-all duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_8px_rgba(0,200,255,0.8)]">
            <h3 className="text-3xl font-semibold mb-3 text-white">
              W h o<br />W e<br />A r e ?
            </h3>
          </Link>
        </div>

        {/* Services Section */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-white">Services</h3>
          <ul>
            {data.services.map((service, index) => (
              <li key={index}>
                <Link href="/services" className="hover:text-gray-400">{service.serviceName}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy and Policies Section */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-white">Privacy & Policies</h3>
          <ul>
            {data.privacyAndPolicies.map((term, index) => (
              <li key={index}>
                <Link href="/services" className="hover:text-gray-400">{term.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-white">Contact us</h3>
          <p className="flex items-center gap-2">
            <i className="fas fa-phone-alt"></i> {data.contactNumber}
          </p>
          <p className="flex items-center gap-2">
            <i className="fas fa-envelope"></i> {data.email}
          </p>
          <br />
          <div className="flex space-x-6">
            {data.fbLink && (
              <Link href={data.fbLink} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f text-xl hover:text-blue-500"></i>
              </Link>
            )}
            {data.whatsappLink && (
              <Link href={data.whatsappLink} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp text-xl hover:text-green-500"></i>
              </Link>
            )}
            {data.instaLink && (
              <Link href={data.instaLink} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram text-xl hover:text-pink-500"></i>
              </Link>
            )}
            {data.ytLink && (
              <Link href={data.ytLink} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube text-xl hover:text-red-500"></i>
              </Link>
            )}
            {data.ttLink && (
              <Link href={data.ttLink} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok text-xl hover:text-gray-500"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-gray-700 pt-4">
        <p>&copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
