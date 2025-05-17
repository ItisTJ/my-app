"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Truck, Package, Clock, Calendar } from 'lucide-react'
import { useTypedSelector } from "../../hooks"

const OrderDetails = () => {
  const { order } = useTypedSelector((state) => state)
  const [currentStep, setCurrentStep] = useState(1)
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  useEffect(() => {
    // Calculate estimated delivery date (3-5 days from now)
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 3 + Math.floor(Math.random() * 3)) // Random between 3-5 days

    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Simulate order progress for demo purposes
    const timer = setTimeout(() => {
      setCurrentStep(2) // Move to processing after 2 seconds
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!order.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Loading order details...</h2>
          <p className="text-gray-600 mt-2">Please wait while we fetch your order information.</p>
        </div>
      </div>
    )
  }

  const { orderItems, shippingDetails, paymentMethod, itemsPrice, shippingPrice, discount, totalPrice } = order.data

  const steps = [
    { id: 1, name: "Order Confirmed", icon: <CheckCircle className="w-6 h-6" /> },
    { id: 2, name: "Processing", icon: <Package className="w-6 h-6" /> },
    { id: 3, name: "Shipped", icon: <Truck className="w-6 h-6" /> },
    { id: 4, name: "Delivered", icon: <CheckCircle className="w-6 h-6" /> },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
            <p className="text-gray-600 mt-2">
              Thank you for your order. We've received your order and will begin processing it soon.
            </p>
            <div className="flex items-center mt-4 text-gray-700">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Estimated Delivery: {estimatedDelivery}</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-sm text-gray-500">Order Number</span>
              <div className="text-lg font-bold text-gray-800">#ORD-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Progress</h2>

        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-950 to-teal-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
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
                <div className="text-sm font-medium mt-2 text-center">{step.name}</div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Order Items */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4">
                      <Link href={`/product/${item.productId}`} passHref>
                        <span className="text-blue-600 hover:underline font-medium">{item.name}</span>
                      </Link>
                      <p className="text-gray-500 text-sm">Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(item.qty * item.price).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">${item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <p className="mt-2 text-gray-800">
                  {shippingDetails.address}
                  <br />
                  {shippingDetails.city}, {shippingDetails.postalCode}
                  <br />
                  {shippingDetails.country}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p className="mt-2 text-gray-800">Cash On Delivery</p>

                <h3 className="text-sm font-medium text-gray-500 mt-4">Contact Information</h3>
                <p className="mt-2 text-gray-800">
                  {shippingDetails.name || "Customer"}
                  <br />
                  {shippingDetails.email || "customer@example.com"}
                  <br />
                  {shippingDetails.phone || "+1 (555) 123-4567"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-rose-500">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/" passHref>
                <button className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg">
                  <span className="relative z-10">Continue Shopping</span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </button>
              </Link>

              <button className="w-full text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center justify-center mt-4">
                <ArrowLeft size={16} className="mr-1" />
                Need Help? Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
