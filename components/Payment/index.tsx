"use client"

import FormContainer from "../FormContainer"
import CheckoutSteps from "../CheckoutSteps"
import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { useAuth, useCartActions } from "../../hooks"
import Link from "next/link"
import Image from "next/image"
import { LockIcon, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react'

const Payment = () => {
  useAuth()

  const [paymentMethod, setPaymentMethod] = useState("CreditCard")
  const { savePaymentMethod } = useCartActions()

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    savePaymentMethod(paymentMethod)
  }

  const paymentOptions = [
    {
      id: "CreditCard",
      label: "Credit Card",
      description: "Pay securely with your credit or debit card",
      icons: [
        { src: "/images/amex.png", alt: "American Express", width: 40, height: 25 },
        { src: "/images/visa.png", alt: "Visa", width: 40, height: 25 },
        { src: "/images/mastercard.png", alt: "Mastercard", width: 40, height: 25 },
      ],
    },
    {
      id: "PayPal",
      label: "PayPal",
      description: "Fast, secure payments online",
      icons: [{ src: "/images/paypal.png", alt: "PayPal", width: 40, height: 25 }],
    },
    {
      id: "Cash",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icons: [],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative h-24 bg-gradient-to-r from-blue-100 to-teal-100">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg"
          >
            <CreditCard size={32} className="text-gray-700" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-6">
            Payment Method
          </motion.h1>

          <motion.form variants={containerVariants} onSubmit={onSubmitHandler} className="space-y-5 max-w-md mx-auto">
            <div className="space-y-4">
              {paymentOptions.map((option, index) => (
                <motion.label
                  key={option.id}
                  variants={itemVariants}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    paymentMethod === option.id
                      ? "border-2 border-teal-500 bg-gradient-to-r from-rose-50 to-teal-50"
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === option.id ? "border-teal-500" : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-950 to-teal-500"
                        />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{option.label}</span>
                      <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {option.icons.map((icon, index) => (
                      <div key={index} className="flex items-center">
                        <Image
                          src={icon.src || "/placeholder.svg?height=25&width=40"}
                          alt={icon.alt}
                          width={icon.width}
                          height={icon.height}
                        />
                      </div>
                    ))}
                    {option.id === "Cash" && <span className="text-xl">💵</span>}
                  </div>
                  <input
                    type="radio"
                    id={option.id}
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </motion.label>
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm flex items-center justify-center space-x-2 mt-6"
            >
              <LockIcon size={14} />
              <span>All payments are secure and encrypted</span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col space-y-3 pt-4">
              <button
                type="submit"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  Continue to Payment
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>

              <Link href="/shipping" className="w-full">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Shipping
                </button>
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </FormContainer>
  )
}

export default Payment


