import React, { useEffect, useState } from "react";

interface Banner {
  _id: string;
  title: string;
  image: string;
  productId: string;
  enable: boolean;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
}

const RandomEnabledBanner: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerAndProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const bannerRes = await fetch("http://localhost:4000/api/banner/enabled");
        if (!bannerRes.ok) throw new Error(`Banner error: ${bannerRes.status}`);
        const enabledBanners: Banner[] = await bannerRes.json();
        const random = enabledBanners[Math.floor(Math.random() * enabledBanners.length)];
        setBanner(random);

        // Now fetch product using banner.productId
        const productRes = await fetch(`http://localhost:4000/api/products/${random.productId}`);
        if (!productRes.ok) throw new Error(`Product error: ${productRes.status}`);
        const productData: Product = await productRes.json();
        setProduct(productData);

      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerAndProduct();
  }, []);

  if (loading) return <div>Loading banner...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!banner || !product) return <div>No data to show.</div>;

  return (
  <div className="w-full p-4">
    <div className="flex flex-col md:flex-row 
  bg-gradient-to-r from-red-500 via-yellow-300 to-purple-600 
  bg-[length:400%_400%] animate-border 
  p-[3px] rounded-xl shadow-xl">



      {/* Banner Image with 8:3 Ratio */}
      <div className="flex w-full md:w-1/2">
        <div className="aspect-[8/3] bg-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden mt-auto mb-auto">
          <a href={`/product/${banner.productId}`} className="block w-full h-full">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover shadow-4xl"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x300?text=Image+not+found";
              }}
            />
          </a>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full ml-[3px] md:w-1/2 bg-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none p-4 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-2">
            <a href={`/product/${banner.productId}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-h-[200px] object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x200?text=Product+Image";
                }}
              />
            </a>
          </div>

          <div className="w-full md:w-1/2 p-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{banner.title}</h2>
            <p className="text-gray-600 mb-2">
              Price: <span className="font-bold text-xl text-green-600">${product.price.toFixed(2)}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Rating:{" "}
              <span className="font-semibold text-yellow-500 text-xl">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.rating) ? "★" :
                      i < product.rating ? "☆" : "☆"}
                  </span>
                ))}
              </span>
            </p>

            {/* Rainbow Border Button */}
            <button
              className="border-1 border-pink-500 text-pink-500 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg hover:bg-purple-500 hover:text-white hover:shadow-xl"
              onClick={() => window.location.href = `/product/${banner.productId}`}
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default RandomEnabledBanner;
