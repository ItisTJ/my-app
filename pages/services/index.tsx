import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

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

  if (loading) return <p className="p-6 text-center">Loading service...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!service) return <p className="p-6 text-center">Service not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/">
        <a className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Home</a>
      </Link>
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      {service.image && (
        // Use next/image if you want optimization, or regular img
        <img
          src={service.image}
          alt={service.title}
          className="w-full max-h-80 object-contain mb-4 rounded"
        />
      )}
      <p className="text-lg whitespace-pre-line">{service.description}</p>
    </div>
  );
};

export default ServicePage;
