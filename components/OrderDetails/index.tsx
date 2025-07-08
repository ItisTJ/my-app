"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // ✅ Get orderId from URL
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  Package,
  Clock,
  Calendar,
} from "lucide-react";
import { useTypedSelector, useOrderActions } from "../../hooks"; // ✅ import actions
import Loader from "../Loader";
import Message from "../Message";
import OrderSummaryContent from "../OrderSummary";

const OrderDetails = () => {
  const router = useRouter();
  const { orderId } = router.query; // ✅ Get orderId from URL
  const { fetchOrder } = useOrderActions(); // ✅ Action to fetch specific order
  const { data: order, loading, error } = useTypedSelector(
    (state) => state.order
  ); // ✅ Pull single order data

  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId); // ✅ Fetch order details from API
    }
  }, [orderId]);

  useEffect(() => {
    // Calculate estimated delivery date (3-5 days from now)
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(
      today.getDate() + 3 + Math.floor(Math.random() * 3)
    ); // Random between 3-5 days

    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Simulate order progress for demo purposes
    const timer = setTimeout(() => {
      setCurrentStep(2); // Move to processing after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Order not found
          </h2>
          <p className="text-gray-600 mt-2">
            The order details could not be loaded. Please check the URL or go
            back to your orders.
          </p>
          <Link href="/orders">
            <a className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
              Back to Orders
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const {
    orderItems,
    shippingDetails,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = order;

  const steps = [
    { id: 1, name: "Order Confirmed", icon: <CheckCircle className="w-6 h-6" /> },
    { id: 2, name: "Processing", icon: <Package className="w-6 h-6" /> },
    { id: 3, name: "Shipped", icon: <Truck className="w-6 h-6" /> },
    { id: 4, name: "Delivered", icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order._id}
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for your order. We’ve received your order and will begin
              processing it soon.
            </p>
            <div className="flex items-center mt-4 text-gray-700">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Estimated Delivery: {estimatedDelivery}</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-sm text-gray-500">Order Total</span>
              <div className="text-lg font-bold text-gray-800">
                ${totalPrice}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Order Progress
        </h2>

        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-950 to-teal-500 transition-all duration-500"
              style={{
                width: `${
                  ((currentStep - 1) / (steps.length - 1)) * 100
                }%`,
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    step.id <= currentStep
                      ? "bg-gradient-to-r from-blue-950 to-teal-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="text-sm font-medium mt-2 text-center">
                  {step.name}
                </div>
                {step.id === currentStep && (
                  <div className="mt-1 text-xs text-teal-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Current Status</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <OrderSummaryContent />
      </div>
    </div>
  );
};

export default OrderDetails;
