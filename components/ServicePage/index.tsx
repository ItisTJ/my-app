import React from "react";

interface Props {
  service: {
    _id: string;
    title: string;
    description: string;
    image: string;
  };
}

const ServicePage: React.FC<Props> = ({ service }) => {
  if (!service) {
    return <p className="text-center p-4">No service data provided.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      <p className="mb-6 text-gray-700">{service.description}</p>
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full max-h-[500px] object-contain rounded shadow"
        />
      )}
    </div>
  );
};

export default ServicePage;
