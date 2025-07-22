"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { useTypedSelector, useOrderActions, useUserActions } from "../../hooks";
import Loader from "../Loader";
import Message from "../Message";

const statusMap: { [key: number]: string } = {
  1: "Order Confirmed",
  2: "Processing",
  3: "Shipped",
  4: "Delivered",
};

const OrderDetails = ({ orderId }: { orderId: string }) => {
  const { fetchOrder } = useOrderActions();
  const { data: order, loading, error } = useTypedSelector(
    (state) => state.order
  );

  const user = useTypedSelector((state) => state.user.data);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Fetch order on mount
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  // Sync current step with backend status
  useEffect(() => {
    if (order && order.status) {
      const stepId = Object.keys(statusMap).find(
        (key) => statusMap[parseInt(key)] === order.status
      );
      if (stepId) {
        setCurrentStep(parseInt(stepId));
      }
    }
  }, [order]);

  // Calculate estimated delivery
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3 + Math.floor(Math.random() * 3));

    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Update status in backend
  const handleStepClick = async (stepId: number) => {
    if (stepId <= currentStep) return; // Prevent going backward

    const newStatus = statusMap[stepId];
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/${order._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`, // Add token if required
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      console.log("Order status updated successfully");
      await fetchOrder(orderId); // Fetch updated status
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update order status. Please try again.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Order not found</h2>
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

  const steps = [
    { id: 1, name: "Order Confirmed", icon: <CheckCircle className="w-6 h-6" /> },
    { id: 2, name: "Processing", icon: <Package className="w-6 h-6" /> },
    { id: 3, name: "Shipped", icon: <Truck className="w-6 h-6" /> },
    { id: 4, name: "Delivered", icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Order header */}
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
                ${order.totalPrice.toFixed(2)}
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
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id > currentStep ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => handleStepClick(step.id)}
              >
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

      {/* Shipping Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-4">
          <MapPin className="w-5 h-5 mr-2 text-teal-600" />
          Shipping Details
        </h3>
        <p><strong>Address:</strong> {order.shippingDetails.address}</p>
        <p><strong>City:</strong> {order.shippingDetails.city}</p>
        <p><strong>Postal Code:</strong> {order.shippingDetails.postalCode}</p>
        <p><strong>Country:</strong> {order.shippingDetails.country}</p>
        <p className="mt-2">
          <strong>Status:</strong>{" "}
          {order.isDelivered ? (
            <span className="text-teal-600">Delivered</span>
          ) : (
            <span className="text-yellow-500">Not Delivered</span>
          )}
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-4">
          <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
          Payment Method
        </h3>
        <p><strong>Method:</strong> {order.paymentMethod}</p>
        <p className="mt-2">
          <strong>Paid:</strong>{" "}
          {order.isPaid ? (
            <span className="text-teal-600">Yes</span>
          ) : (
            <span className="text-red-600">No</span>
          )}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="flex items-center text-lg font-semibold mb-4">
          <ShoppingCart className="w-5 h-5 mr-2 text-teal-600" />
          Order Items
        </h3>
        {order.orderItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b py-3 last:border-none"
          >
            <div className="flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
            </div>
            <div className="font-semibold">${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
