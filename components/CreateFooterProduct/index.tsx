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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchFooter() as any);
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

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!footerData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\+?[0-9\s\-]{10,15}$/.test(footerData.contactNumber)) {
      newErrors.contactNumber = "Invalid contact number format.";
    }

    if (!footerData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!footerData.aboutUs.trim()) {
      newErrors.aboutUs = "About Us section cannot be empty.";
    }

    const socialFields = ["fbLink", "whatsappLink", "instaLink", "ytLink", "ttLink"];
    for (const field of socialFields) {
      const value = footerData[field as keyof typeof footerData];
      if (value && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
        newErrors[field] = "Invalid URL format.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!validateInputs()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      await proshopAPI.post("/api/footer/upload", footerData, config);
      setMessage("Footer updated successfully.");
      dispatch(fetchFooter() as any);
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
        <div className="mb-4 text-center">
          <Message variant="danger">
            {error}
          </Message>
        </div>
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
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>
              )}
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
                onChange={(e) =>
                  setFooterData({ ...footerData, email: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="example@mail.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
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
              />
              {errors.aboutUs && (
                <p className="text-red-600 text-sm mt-1">{errors.aboutUs}</p>
              )}
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
                onChange={(e) =>
                  setFooterData({ ...footerData, vision: e.target.value })
                }
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
                onChange={(e) =>
                  setFooterData({ ...footerData, mission: e.target.value })
                }
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
                  {errors[id] && (
                    <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="secondary w-full text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            Submit Details
          </button>
        </form>
      )}
    </div>
  );
};

export default FooterManager;
