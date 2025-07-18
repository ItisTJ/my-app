import { useEffect, useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const FooterManager = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useTypedSelector((state) => state.footer || { loading: false, error: null, data: [] });
  const footer = Array.isArray(data) && data.length > 0 ? data[0] : null;

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

  const [message, setMessage] = useState<string | null | string[]>(error);

  useEffect(() => {
    dispatch(fetchFooter());
  }, [dispatch]);

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

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      await proshopAPI.post("/api/footer/upload", footerData, config);
      window.location.reload();
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload footer item.");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <FormContainer>
          <h1 className="text-3xl font-bold text-center mb-6">Update Footer</h1>
          {message && <Message variant="danger">{message}</Message>}
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <label htmlFor="contactNumber" className="block font-bold mb-1">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="text"
                value={footerData.contactNumber}
                onChange={(e) => setFooterData({ ...footerData, contactNumber: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-bold mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="aboutUs" className="block font-bold mb-1">
                About Us
              </label>
              <textarea
                id="aboutUs"
                rows={10}
                value={footerData.aboutUs}
                onChange={(e) => setFooterData({ ...footerData, aboutUs: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="fbLink" className="block font-bold mb-1">
                Facebook Link
              </label>
              <input
                id="fbLink"
                type="text"
                value={footerData.fbLink}
                onChange={(e) => setFooterData({ ...footerData, fbLink: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="whatsappLink" className="block font-bold mb-1">
                WhatsApp Link
              </label>
              <input
                id="whatsappLink"
                type="text"
                value={footerData.whatsappLink}
                onChange={(e) => setFooterData({ ...footerData, whatsappLink: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="instaLink" className="block font-bold mb-1">
                Instagram Link
              </label>
              <input
                id="instaLink"
                type="text"
                value={footerData.instaLink}
                onChange={(e) => setFooterData({ ...footerData, instaLink: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="ytLink" className="block font-bold mb-1">
                YouTube Link
              </label>
              <input
                id="ytLink"
                type="text"
                value={footerData.ytLink}
                onChange={(e) => setFooterData({ ...footerData, ytLink: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="ttLink" className="block font-bold mb-1">
                TikTok Link
              </label>
              <input
                id="ttLink"
                type="text"
                value={footerData.ttLink}
                onChange={(e) => setFooterData({ ...footerData, ttLink: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
            >
              Submit Footer
            </button>
          </form>
        </FormContainer>
      )}
    </>
  );
};

export default FooterManager;
