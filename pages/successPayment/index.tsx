"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        alert("No session ID found");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/orders/create-from-stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        router.push("/orders");
      } catch (error) {
        alert("Failed to finalize order");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    createOrderAfterPayment();
  }, [router]);

  if (loading) return <div>Processing your order...</div>;

  return <div>Order completed successfully!</div>;
};

export default SuccessPage;
