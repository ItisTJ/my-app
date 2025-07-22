import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { FaServicestack } from "react-icons/fa";

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const ServicePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/services/${id}`);
        setService(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load service data.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-2xl shadow-2xl my-12">
      {/* Back link */}
      <Link
        href="/"
        className="text-blue-600 hover:underline text-sm inline-block mb-4 mt-6 "
      >
        &larr; Back to Home
      </Link>

      {/* Page Title with icon */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center mt-6 flex justify-center items-center gap-3">
        <FaServicestack className="text-aqua-500" />
        Service Information
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading service...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : !service ? (
        <p className="text-center text-gray-600">Service not found.</p>
      ) : (
        <>
          {/* Service Title */}
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
            {service.title}
          </h2>

          {/* Service Image */}
          {service.image && (
            <div className="flex justify-center mb-8">
              <img
                src={service.image}
                alt={`Image for service: ${service.title}`}
                className="rounded-xl max-w-full max-h-[400px] object-contain shadow-md"
              />
            </div>
          )}

          {/* Service Description */}
          <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line  text-justify">
            {service.description}
          </p>
        </>
      )}
    </div>
  );
};

export default ServicePage;
