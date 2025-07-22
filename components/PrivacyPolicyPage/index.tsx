import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

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
        setError("Failed to load service data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading service...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!privacyPolicy) return <p className="p-6 text-center">Service not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/"
        className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{privacyPolicy.title}</h1>
      <p className="text-lg whitespace-pre-line">{privacyPolicy.description}</p>
    </div>
  );
};

export default PrivacyPolicyPage;
