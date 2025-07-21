'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  // Add more fields if needed
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); // Show first 6 items

  useEffect(() => {
    if (category) {
      fetch(`http://localhost:4000/api/products/category/${category}?page=1`)
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(err => console.error('Failed to fetch products', err));
    }
  }, [category]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6); // Show 6 more each time
  };

  const handleShowLess = () => {
    setVisibleCount(6); // Reset to 6
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Showing {category ?? 'All'} Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {visibleProducts.map(({ _id, name, price, image }) => (
      <div
        key={_id}
        className="my-3 p-3 rounded cursor-pointer bg-white shadow hover:shadow-md transition-shadow h-full"
        role="button" // Makes the card feel like a clickable item (accessibility)
      >
        {/* Product Image with link to product details page */}
        <div className="h-64 w-full flex flex-col items-center overflow-hidden">
          <Link href={`/product/${_id}`} passHref className='mt-auto mb-auto'>
            <img
              src={image}
              alt={name}
              className="w-64 object-cover rounded-t" // set fixed width
            />
          </Link>
        </div>

        {/* Product text details */}
        <div className="flex flex-col items-center justify-between pt-auto pb-0">
          {/* Product Name with link to product details */}
          <Link href={`/product/${_id}`} passHref>
            <h3 className="text-lg font-bold">
              {name}
            </h3>
          </Link>

          {/* Product Price */}
          <h3 className="text-xl font-semibold py-1">
            ${price}
          </h3>
        </div>
      </div>
    ))}
      </div>

      {products.length > 6 && (
        <div className="mt-6 text-center">
          {visibleCount < products.length ? (
            <button
              onClick={handleShowMore}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
