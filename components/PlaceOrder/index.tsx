"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useOrderActions, useShipping, useTypedSelector } from "../../hooks"
import CheckoutSteps from "../CheckoutSteps"
import { CreditCard, Check, MapPin, ShoppingBag, ArrowRight, LockIcon, X } from 'lucide-react'

// Payment details interface
interface PaymentDetails {
  method: "CreditCard" | "PayPal"
  cardHolder?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  saveForFuture?: boolean
}

// Payment Modal Component
const PaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialMethod,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (paymentDetails: PaymentDetails) => void
  initialMethod: "CreditCard" | "PayPal"
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"CreditCard" | "PayPal">(initialMethod)
  const [cardHolder, setCardHolder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [saveCard, setSaveCard] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod(initialMethod)
      setCardHolder("")
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setSaveCard(false)
    }
  }, [isOpen, initialMethod])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      method: paymentMethod,
      cardHolder: paymentMethod === "CreditCard" ? cardHolder : undefined,
      cardNumber: paymentMethod === "CreditCard" ? cardNumber : undefined,
      expiryDate: paymentMethod === "CreditCard" ? expiryDate : undefined,
      cvv: paymentMethod === "CreditCard" ? cvv : undefined,
      saveForFuture: saveCard,
    })
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* Payment Method Selection */}
          <div className="space-y-4 mb-6">
            <div
              className={`flex items-center justify-between p-4 border ${
                paymentMethod === "CreditCard" ? "border-teal-500" : "border-gray-700"
              } rounded-2xl cursor-pointer bg-gray-800 hover:bg-gray-750 transition-all duration-300`}
              onClick={() => setPaymentMethod("CreditCard")}
            >
              <div className="flex items-center">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center mr-3">
                  <Image src="/images/visa.png" alt="Visa" width={40} height={24} />
                </div>
                <span className="text-white font-medium">Credit or Debit Card</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  paymentMethod === "CreditCard" ? "border-teal-500" : "border-gray-600"
                } flex items-center justify-center`}
              >
                {paymentMethod === "CreditCard" && (
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                )}
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 border ${
                paymentMethod === "PayPal" ? "border-teal-500" : "border-gray-700"
              } rounded-2xl cursor-pointer bg-gray-800 hover:bg-gray-750 transition-all duration-300`}
              onClick={() => setPaymentMethod("PayPal")}
            >
              <div className="flex items-center">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center mr-3">
                  <Image src="/images/paypal.png" alt="PayPal" width={40} height={24} />
                </div>
                <span className="text-white font-medium">PayPal</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  paymentMethod === "PayPal" ? "border-teal-500" : "border-gray-600"
                } flex items-center justify-center`}
              >
                {paymentMethod === "PayPal" && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 my-6"></div>

          {/* Credit Card Form Fields - Only show if Credit Card is selected */}
          <AnimatePresence>
            {paymentMethod === "CreditCard" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div>
                  <label htmlFor="cardHolder" className="block mb-2 text-sm font-medium text-gray-300">
                    Card Holder
                  </label>
                  <input
                    type="text"
                    id="cardHolder"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block mb-2 text-sm font-medium text-gray-300">
                    Card Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Image src="/images/visa.png" alt="Visa" width={30} height={18} />
                    </div>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full p-4 pl-14 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      placeholder="1234 5678 1234 5678"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block mb-2 text-sm font-medium text-gray-300">
                      Exp. Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "")
                        if (value.length <= 4) {
                          const month = value.slice(0, 2)
                          const year = value.slice(2, 4)
                          setExpiryDate(value.length > 2 ? `${month}/${year}` : value)
                        }
                      }}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block mb-2 text-sm font-medium text-gray-300">
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, "")
                          if (value.length <= 3) setCvv(value)
                        }}
                        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <div
                    className={`w-5 h-5 rounded border ${
                      saveCard ? "border-teal-500 bg-teal-500" : "border-gray-600"
                    } flex items-center justify-center mr-3 cursor-pointer`}
                    onClick={() => setSaveCard(!saveCard)}
                  >
                    {saveCard && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <label htmlFor="saveCard" className="text-sm text-gray-300 cursor-pointer" onClick={() => setSaveCard(!saveCard)}>
                    Save card for future payments
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PayPal message - Only show if PayPal is selected */}
          <AnimatePresence>
            {paymentMethod === "PayPal" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center py-4 text-gray-300"
              >
                <p>You will be redirected to PayPal to complete your payment.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ShippingInfo = ({ shippingDetails }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6"
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-3">
        <MapPin className="h-5 w-5 text-rose-500" />
      </div>
      <h2 className="text-xl font-bold">Shipping Address</h2>
    </div>
    <p className="text-gray-700 ml-13">
      {shippingDetails.address}, {shippingDetails.city} {shippingDetails.postalCode}, {shippingDetails.country}
    </p>
  </motion.div>
)

const PaymentMethodInfo = ({ method }: { method: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white rounded-xl shadow-md p-6"
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
        <CreditCard className="h-5 w-5 text-teal-500" />
      </div>
      <h2 className="text-xl font-bold">Payment Method</h2>
    </div>
    <p className="text-gray-700 ml-13">
      <span className="font-semibold">Method: </span>
      {method}
    </p>
  </motion.div>
)

const OrderItems = ({ items }: { items: any[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white rounded-xl shadow-md p-6"
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
        <ShoppingBag className="h-5 w-5 text-gray-700" />
      </div>
      <h2 className="text-xl font-bold">Order Items</h2>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          key={index}
          className="flex items-center py-4 border-b border-gray-100 last:border-0"
        >
          <div className="w-16 h-16 flex-shrink-0 mr-4 relative rounded-lg overflow-hidden">
            {item.image && (
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            )}
          </div>
          <div className="flex-grow">
            <Link
              href={`/product/${item.product}`}
              className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
            >
              {item.name}
            </Link>
          </div>
          <div className="text-right text-gray-700">
            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

const OrderTemplate = ({ method }: { method: string }) => {
  useShipping()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)

  const { cart } = useTypedSelector((state) => state)
  const { error } = useTypedSelector((state) => state.order)
  const { createOrder } = useOrderActions()

  const handlePaymentSubmit = (details: PaymentDetails) => {
    setPaymentDetails(details)
    setShowPaymentModal(false)
  }

  const onPlaceOrderHandler = () => {
    if ((method === "CreditCard" || method === "PayPal") && !paymentDetails) {
      setShowPaymentModal(true)
      return
    }

    setIsSubmitting(true)
    const { itemsPrice, cartItems, paymentMethod, shippingDetails, shippingPrice, taxPrice, totalPrice } = cart.data

    createOrder({
      paymentMethod,
      shippingDetails,
      shippingPrice,
      taxPrice,
      totalPrice,
      itemsPrice,
      orderItems: cartItems,
      paymentDetails: paymentDetails || undefined,
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <CheckoutSteps step1 step2 step3 step4 />

      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handlePaymentSubmit}
            initialMethod={method as "CreditCard" | "PayPal"}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <ShippingInfo shippingDetails={cart.data.shippingDetails} />
          <PaymentMethodInfo method={method} />
          {paymentDetails && (method === "CreditCard" || method === "PayPal") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-teal-500" />
                  </div>
                  <h2 className="text-xl font-bold">Payment Details</h2>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              {paymentDetails.method === "CreditCard" && (
                <div className="mt-4 ml-13 text-gray-700">
                  <p>
                    <span className="font-semibold">Card Holder:</span> {paymentDetails.cardHolder}
                  </p>
                  <p>
                    <span className="font-semibold">Card Number:</span> •••• •••• ••••{" "}
                    {paymentDetails.cardNumber?.slice(-4)}
                  </p>
                  <p>
                    <span className="font-semibold">Expires:</span> {paymentDetails.expiryDate}
                  </p>
                </div>
              )}
              {paymentDetails.method === "PayPal" && (
                <p className="mt-4 ml-13 text-gray-700">You will complete your payment with PayPal.</p>
              )}
            </motion.div>
          )}
          <OrderItems items={cart.data.cartItems} />
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 sticky top-8"
          >
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">${cart.data.itemsPrice}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {cart.data.shippingPrice !== 0 ? `$${cart.data.shippingPrice}` : "Free"}
                </span>
              </div>

              

              <div className="flex justify-between py-2 border-t border-gray-100 pt-4 mt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${cart.data.totalPrice}</span>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 text-red-700 p-4 rounded-lg mt-4"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="button"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
                disabled={cart.data.cartItems.length === 0 || isSubmitting}
                onClick={onPlaceOrderHandler}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  {isSubmitting ? (
                    "Processing..."
                  ) : paymentDetails ? (
                    "Place Order"
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-blue-950 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export const CreditOrder = () => <OrderTemplate method="CreditCard" />
export const PayPalOrder = () => <OrderTemplate method="PayPal" />
export const CashOrder = () => <OrderTemplate method="Cash" />






