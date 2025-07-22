import React from "react";
import Link from "next/link";
import { FaServicestack } from "react-icons/fa";

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const dummyService: Service = {
  _id: "1",
  title: "PRODUCT BROWSING & SEARCH",
  description:
    "Our e-commerce platform provides facility to Product Browsing & Search. \nYou can easily search and explore a wide range of products through our user-friendly interface.",
  image: "https://via.placeholder.com/800x400?text=Service+Image",
};

const ServicePage = () => {
  const service = dummyService; 

  if (!service) {
    return (
      <div className="text-center p-6 text-gray-600">
        No service data provided.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl">
      {/* Back link */}
      <Link
        href="/services"
        className="inline-block text-blue-600 hover:underline text-sm mb-6"
      >
        &larr; Back to Services
      </Link>

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center justify-center gap-3">
        <FaServicestack className="text-indigo-600" />
        Service Information
      </h1>

      {/* Service Title */}
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        {service.title}
      </h2>

      {/* Service Image */}
      {service.image && (
        <div className="flex justify-center mb-8">
          <img
            src={service.image}
            alt={service.title}
            className="rounded-xl max-w-full max-h-[400px] object-contain shadow-md"
          />
        </div>
      )}

      {/* Service Description */}
      <p className="text-lg leading-relaxed whitespace-pre-line text-gray-800 text-center">
        {service.description}
      </p>
    </div>
  );
};

export default ServicePage;
