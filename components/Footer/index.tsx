import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import axios from "axios";

const Footer: React.FC = () => {
  const [services, setServices] = useState([]);
  const [privacyPolicy, setprivacyPolicy] = useState([]);
  const [branches, setBranches] = useState([]);
  const dispatch = useDispatch();

  const { loading, error, footerdata } = useTypedSelector((state) => ({
    loading: state.footer?.loading || false,
    error: state.footer?.error || null,
    footerdata: state.footer?.data || [],
  }));

  const footer = footerdata.length > 0 ? footerdata[0] : null;

  const [footerData, setFooterData] = useState({
    contactNumber: footer?.contactNumber || "",
    email: footer?.email || "",
    aboutUs: footer?.aboutUs || "",
    vision: footer?.vision || "",
    mission: footer?.mission || "",
    fbLink: footer?.fbLink || "",
    whatsappLink: footer?.whatsappLink || "",
    instaLink: footer?.instaLink || "",
    ytLink: footer?.ytLink || "",
    ttLink: footer?.ttLink || "",
  });

  useEffect(() => {
    if (!footerdata.length) {
      dispatch(fetchFooter());
    }
  }, [dispatch, footerdata.length]);

  useEffect(() => {
    if (footer) {
      setFooterData({
        contactNumber: footer.contactNumber,
        email: footer.email,
        aboutUs: footer.aboutUs,
        vision: footer.vision,
        mission: footer.mission,
        fbLink: footer.fbLink,
        whatsappLink: footer.whatsappLink,
        instaLink: footer.instaLink,
        ytLink: footer.ytLink,
        ttLink: footer.ttLink,
      });
    }
  }, [footer]);

  useEffect(() => {
    const fetchServicesFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServicesFromAPI();
  }, [footer]);

  useEffect(() => {
    const fetchPrivacyPoliciesFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/privacyPolicy");
        setprivacyPolicy(response.data);
      } catch (error) {
        console.error("Error fetching privacy & policy:", error);
      }
    };
    fetchPrivacyPoliciesFromAPI();
  }, [footer]);

  useEffect(() => {
    const fetchbranchesFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchbranchesFromAPI();
  }, [footer]);

  const data = {
    branches: branches,
    aboutUs: footerData.aboutUs,
    vision: footerData.vision,
    mission: footerData.mission,
    services: services,
    privacyAndPolicies: privacyPolicy,
    contactNumber: footerData.contactNumber,
    email: footerData.email,
    fbLink: footerData.fbLink,
    whatsappLink: footerData.whatsappLink,
    instaLink: footerData.instaLink,
    ytLink: footerData.ytLink,
    ttLink: footerData.ttLink,
  };

  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10">
        {/* Branches */}
        <div className="w-full border-b border-gray-700 pb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-100">Branches</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {data.branches.map((branch, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-gray-800 p-4 rounded-xl shadow-lg min-w-[200px]"
                >
                  <h4 className="text-white font-semibold">{branch.city}</h4>
                  <a href={branch.location} target="_blank" rel="noopener noreferrer">
                    <div className="w-[180px] h-[110px] relative mt-2">
                      <Image
                        src={branch.image}
                        alt={branch.city}
                        fill
                        className="object-cover rounded cursor-pointer"
                      />
                    </div>
                  </a>
                  <p className="text-xs text-blue-300 mt-2">
                    📞 {branch.contact}
                  </p>
                  <p className="text-xs text-green-300">
                    🕒 Open: {branch.openAt} - {branch.closeAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="flex-1 min-w-[200px]">
          <Link href="/about">
            <h3 className="text-3xl font-bold leading-tight hover:text-blue-400 transition-all text-gray-200">
              W h o<br />W e<br />A r e ?
            </h3>
          </Link>
        </div>

        {/* Services */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-gray-100">Services</h3>
          <ul className="space-y-2">
            {data.services.map((service: any, index: number) => (
              <li key={index}>
                <Link href={`/services/?id=${service._id}`} className="hover:text-blue-300">{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy and Policies */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-gray-100">Privacy & Policies</h3>
          <ul className="space-y-2">
            {data.privacyAndPolicies.map((privacyPolicy: any, index: number) => (
              <li key={index}>
                <Link href={`/privacyPolicies/?id=${privacyPolicy._id}`} className="hover:text-blue-300">{privacyPolicy.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-3 text-gray-100">Contact Us</h3>
          <p className="flex items-center gap-2 mb-1">📞 {data.contactNumber}</p>
          <p className="flex items-center gap-2">✉️ {data.email}</p>

          <div className="flex space-x-4 mt-4">
            {data.fbLink && (
              <Link href={data.fbLink} target="_blank">
                <i className="fab fa-facebook-f text-xl hover:text-blue-500"></i>
              </Link>
            )}
            {data.whatsappLink && (
              <Link href={data.whatsappLink} target="_blank">
                <i className="fab fa-whatsapp text-xl hover:text-green-500"></i>
              </Link>
            )}
            {data.instaLink && (
              <Link href={data.instaLink} target="_blank">
                <i className="fab fa-instagram text-xl hover:text-pink-500"></i>
              </Link>
            )}
            {data.ytLink && (
              <Link href={data.ytLink} target="_blank">
                <i className="fab fa-youtube text-xl hover:text-red-500"></i>
              </Link>
            )}
            {data.ttLink && (
              <Link href={data.ttLink} target="_blank">
                <i className="fab fa-tiktok text-xl hover:text-white"></i>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 border-t border-gray-700 pt-4 text-sm">
        <p>&copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
