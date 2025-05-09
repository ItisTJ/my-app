"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCartActions, useTypedSelector } from "../../hooks"
import Link from "next/link"
import Image from "next/image"
import { v4 as randomID } from "uuid"
import { motion, AnimatePresence } from "framer-motion"
import Message from "../Message"
import EmptyCart from "../../components/EmptyCart"
import Loader from "../Loader"
import { useRouter } from "next/router"
import { MinusIcon, PlusIcon, XIcon, ArrowLeftIcon, Truck, ShoppingBag } from "lucide-react"

interface CartItem {
  productId: string
  image: string
  name: string
  price: number
  qty: number
  countInStock: number
}

interface Region {
  name: string
  distance: number
  rate: number
}

const Cart: React.FC = () => {
  const router = useRouter()

  const [showNotification, setShowNotification] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [shipping, setShipping] = useState(0)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [city, setCity] = useState("")
  const [postcode, setPostcode] = useState("")

  // Sri Lankan regions with distances from Colombo (in km) and shipping rates (in LKR)
  const regions: Region[] = [
    { name: "Colombo", distance: 0, rate: 200 },
    { name: "Gampaha", distance: 28, rate: 300 },
    { name: "Kalutara", distance: 42, rate: 350 },
    { name: "Kandy", distance: 115, rate: 400 },
    { name: "Matale", distance: 142, rate: 450 },
    { name: "Nuwara Eliya", distance: 180, rate: 500 },
    { name: "Galle", distance: 119, rate: 400 },
    { name: "Matara", distance: 160, rate: 450 },
    { name: "Hambantota", distance: 238, rate: 550 },
    { name: "Jaffna", distance: 398, rate: 700 },
    { name: "Kilinochchi", distance: 328, rate: 650 },
    { name: "Mannar", distance: 220, rate: 550 },
    { name: "Vavuniya", distance: 254, rate: 600 },
    { name: "Mullaitivu", distance: 333, rate: 650 },
    { name: "Batticaloa", distance: 314, rate: 650 },
    { name: "Ampara", distance: 347, rate: 650 },
    { name: "Trincomalee", distance: 257, rate: 600 },
    { name: "Kurunegala", distance: 94, rate: 400 },
    { name: "Puttalam", distance: 135, rate: 450 },
    { name: "Anuradhapura", distance: 206, rate: 550 },
    { name: "Polonnaruwa", distance: 216, rate: 550 },
    { name: "Badulla", distance: 230, rate: 550 },
    { name: "Monaragala", distance: 288, rate: 600 },
    { name: "Ratnapura", distance: 101, rate: 400 },
    { name: "Kegalle", distance: 78, rate: 350 },
  ]

  const {
    loading,
    error,
    data: { cartItems },
  } = useTypedSelector((state) => state.cart)
  const { data } = useTypedSelector((state) => state.user)
  const { addToCart, removeFromCart } = useCartActions()

  // Set default region (Colombo)
  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0])
      setShipping(regions[0].rate)
    }
  }, [regions, selectedRegion])

  // Handle notification animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (showNotification) {
      setNotificationVisible(true)
    } else {
      timeoutId = setTimeout(() => {
        setNotificationVisible(false)
      }, 500) // Match this with the CSS transition duration
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [showNotification])

  const onCheckoutHandler = () => {
    const redirect = data ? "/shipping" : "/login"
    router.push(redirect)
  }

  const handleQuantityChange = async (productId: string, newQty: number) => {
    setIsUpdating(true)
    await addToCart({ qty: newQty, productId })
    setIsUpdating(false)
    setShowNotification(true)
    router.replace(router.asPath)

    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = regions.find((r) => r.name === e.target.value)
    if (region) {
      setSelectedRegion(region)
      setShipping(region.rate)
    }
  }

  const handleUpdateShipping = () => {
    if (selectedRegion && city && postcode) {
      setShowShippingForm(false)
    }
  }

  const itemsCount = cartItems.reduce((acc: number, item: CartItem) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.qty * item.price, 0)
  const discount = subtotal * 0.1
  const total = subtotal - discount + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative bg-gray-50">
      <AnimatePresence>
        {notificationVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto mb-6 fixed top-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg shadow-lg flex items-center">
              <span className="mr-2 bg-white text-teal-600 rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </span>
              <span className="font-bold">Cart updated.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-6"
      >
        <Link href="/" className="flex items-center text-gray-800 hover:text-gray-600 group">
          <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        </Link>
      </motion.div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-5">
                    <span className="text-gray-500 font-medium">Product</span>
                  </div>
                  <div className="col-span-4 flex justify-center">
                    <span className="text-gray-500 font-medium">Quantity</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-gray-500 font-medium">Price</span>
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader />
                </div>
              ) : error ? (
                <div className="p-6">
                  <Message variant="danger">{error}</Message>
                </div>
              ) : (
                cartItems.map((item: CartItem, index) => (
                  <motion.div
                    key={randomID()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-5 flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-teal-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-span-4 flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            className="p-2 text-gray-500 hover:text-blue-950 transition-colors disabled:opacity-50"
                            onClick={() => item.qty > 0 && handleQuantityChange(item.productId, item.qty - 1)}
                            disabled={item.qty <= 1 || isUpdating}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.qty}</span>
                          <button
                            className="p-2 text-gray-500 hover:text-teal-500 transition-colors disabled:opacity-50"
                            onClick={() =>
                              item.qty < item.countInStock && handleQuantityChange(item.productId, item.qty + 1)
                            }
                            disabled={item.qty >= item.countInStock || isUpdating}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-gray-900 text-right font-medium">
                        ${item.price.toLocaleString()}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-950 transition-colors"
                          onClick={() => removeFromCart(item.productId)}
                          disabled={isUpdating}
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Discount (10%)</span>
                  <span className="font-medium text-rose-500">-${discount.toLocaleString()}</span>
                </div>

                {/* Shipping Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LKR {shipping.toLocaleString()}</span>
                  </div>

                  {showShippingForm ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 mt-2">
                      <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <select
                          id="region"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                          value={selectedRegion?.name || ""}
                          onChange={handleRegionChange}
                        >
                          {regions.map((region) => (
                            <option key={region.name} value={region.name}>
                              {region.name} ({region.distance} km)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          Town / City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                          Postcode / ZIP <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="postcode"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                        />
                      </div>

                      <button
                        type="button"
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:from-teal-600 hover:to-teal-700 transition-all"
                        onClick={handleUpdateShipping}
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm">
                      {selectedRegion && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <Truck className="h-4 w-4 mr-2 text-teal-500" />
                          <span>
                            Shipping to: {city || selectedRegion.name}
                            {postcode ? `, ${postcode}` : ""}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        onClick={() => setShowShippingForm(true)}
                      >
                        Change address
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={onCheckoutHandler}
                disabled={!selectedRegion || showShippingForm}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  Process Order
                  <ShoppingBag size={16} className="transition-transform duration-300 group-hover:translate-y-[-2px]" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Cart






