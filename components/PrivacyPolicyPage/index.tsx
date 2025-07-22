import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";

interface PrivacyPolicy {
  _id: string;
  title: string;
  description: string;
}

const PrivacyPolicyPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/privacyPolicy/${id}`);
        setPrivacyPolicy(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load policy data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-2xl shadow-2xl my-12">
      <Link
        href="/"
        className="text-blue-600 hover:underline text-sm inline-block mb-4 mt-6"
      >
        &larr; Back to Home
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center mt-6 flex justify-center items-center gap-3">
        <FaShieldAlt className="text-indigo-500" />
        Privacy Policy
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading policy...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : !privacyPolicy ? (
        <p className="text-center text-gray-600">Policy not found.</p>
      ) : (
        <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
            {privacyPolicy.title}
          </h2>
          <p className="text-justify">{privacyPolicy.description}</p>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyPage;
