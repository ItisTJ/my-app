// components/FooterManager.tsx
import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import { proshopAPI } from "../../lib";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const FooterManager = () => {
  const dispatch = useDispatch();

  const { loading, error, data } = useTypedSelector(
    (state) => state.footer || { loading: false, error: null, data: [] }
  );
  const footer = Array.isArray(data) && data.length > 0 ? data[0] : null;

  const [footerData, setFooterData] = useState({
    contactNumber: "",
    email: "",
    aboutUs: "",
    vision: "",
    mission: "",
    fbLink: "",
    whatsappLink: "",
    instaLink: "",
    ytLink: "",
    ttLink: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFooter());
  }, [dispatch]);

  useEffect(() => {
    if (footer) {
      setFooterData({
        contactNumber: footer.contactNumber || "",
        email: footer.email || "",
        aboutUs: footer.aboutUs || "",
        vision: footer.vision || "",
        mission: footer.mission || "",
        fbLink: footer.fbLink || "",
        whatsappLink: footer.whatsappLink || "",
        instaLink: footer.instaLink || "",
        ytLink: footer.ytLink || "",
        ttLink: footer.ttLink || "",
      });
    }
  }, [footer]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      await proshopAPI.post("/api/footer/upload", footerData, config);
      setMessage("Footer updated successfully.");
      dispatch(fetchFooter());
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload footer item.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center mt-8">
        ADD BASIC DETAILS
      </h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
          <button
            onClick={() => setMessage(null)}
            className="float-right text-xl font-bold"
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" className="mb-4 text-center">
          {error}
        </Message>
      ) : (
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="border rounded p-6 bg-white shadow space-y-6">
            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block font-semibold mb-2">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="text"
                value={footerData.contactNumber}
                onChange={(e) =>
                  setFooterData({ ...footerData, contactNumber: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="example@mail.com"
                required
              />
            </div>

            {/* About Us */}
            <div>
              <label htmlFor="aboutUs" className="block font-semibold mb-2">
                About Us
              </label>
              <textarea
                id="aboutUs"
                rows={6}
                value={footerData.aboutUs}
                onChange={(e) =>
                  setFooterData({ ...footerData, aboutUs: e.target.value })
                }
                className="w-full border p-2 rounded resize-y"
                placeholder="Write something about your company..."
                required
              />
            </div>

            {/* Vision */}
            <div>
              <label htmlFor="vision" className="block font-semibold mb-2">
                Vision
              </label>
              <textarea
                id="vision"
                rows={4}
                value={footerData.vision}
                onChange={(e) => setFooterData({ ...footerData, vision: e.target.value })}
                className="w-full border p-2 rounded resize-y"
                placeholder="Write your vision statement..."
              />
            </div>

            {/* Mission */}
            <div>
              <label htmlFor="mission" className="block font-semibold mb-2">
                Mission
              </label>
              <textarea
                id="mission"
                rows={4}
                value={footerData.mission}
                onChange={(e) => setFooterData({ ...footerData, mission: e.target.value })}
                className="w-full border p-2 rounded resize-y"
                placeholder="Write your mission statement..."
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "fbLink", label: "Facebook Link" },
                { id: "whatsappLink", label: "WhatsApp Link" },
                { id: "instaLink", label: "Instagram Link" },
                { id: "ytLink", label: "YouTube Link" },
                { id: "ttLink", label: "TikTok Link" },
              ].map(({ id, label }) => (
                <div key={id}>
                  <label htmlFor={id} className="block font-semibold mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="url"
                    value={footerData[id as keyof typeof footerData]}
                    onChange={(e) =>
                      setFooterData({ ...footerData, [id]: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder={`https://www.${label.toLowerCase().replace(" ", "")}.com/yourprofile`}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-950 to-teal-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            Submit Details
          </button>
        </form>
      )}
    </div>
  );
};

export default FooterManager;
