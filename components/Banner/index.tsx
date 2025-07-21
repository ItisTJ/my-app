import React, { useEffect, useState } from "react";

interface Banner {
  _id: string;
  title: string;
  image: string;
  productId: string;
  enable: boolean;
}

const RandomEnabledBanner: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomEnabledBanner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/banner/enabled");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const enabledBanners: Banner[] = await res.json();

        const randomIndex = Math.floor(Math.random() * enabledBanners.length);
        setBanner(enabledBanners[randomIndex]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomEnabledBanner();
  }, []);

  if (loading) return <div>Loading banner...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!banner) return <div>No enabled banner to show.</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-1 bg-gradient-to-r from-red-500 via-yellow-200 to-pink-500 animate-border bg-[length:400%_400%]">
      <div className="rounded-xl bg-white overflow-hidden shadow-md">
        <a href={`/product/${banner.productId}`} className="block w-full h-full">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full max-h-[400px] object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x300?text=Image+not+found";
            }}
          />
        </a>
      </div>
    </div>
  );
};

export default RandomEnabledBanner;
