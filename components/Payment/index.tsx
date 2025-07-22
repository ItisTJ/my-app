"use client"

import FormContainer from "../FormContainer"
import CheckoutSteps from "../CheckoutSteps"
import { useState, type FormEvent } from "react"
import { useAuth, useCartActions } from "../../hooks"
import Link from "next/link"
import Image from "next/image"
import { LockIcon, CreditCard, ArrowRight, ArrowLeft } from "lucide-react"

const Payment = () => {
  useAuth()

  const [paymentMethod, setPaymentMethod] = useState("Credit Card")
  const { savePaymentMethod } = useCartActions()

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    savePaymentMethod(paymentMethod)
  }

  const paymentOptions = [
    {
      id: "Credit Card",
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
      id: "Cash On Delivery",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icons: [],
    },
  ]

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-blue-100 to-teal-100">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <CreditCard size={32} className="text-gray-700" strokeWidth={1.5} />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h1>

          <form onSubmit={onSubmitHandler} className="space-y-5 max-w-md mx-auto">
            <div className="space-y-4">
              {paymentOptions.map((option, index) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
                    ${
                      paymentMethod === option.id
                        ? "border-2 border-teal-500 bg-gradient-to-r from-rose-50 to-teal-50"
                        : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                        ${paymentMethod === option.id ? "border-teal-500" : "border-gray-300"}`}
                    >
                      {paymentMethod === option.id && (
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-950 to-teal-500" />
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
                    {option.id === "Cash On Delivery" && <span className="text-xl">💵</span>}
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
                </label>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm flex items-center justify-center space-x-2 mt-6">
              <LockIcon size={14} />
              <span>All payments are secure and encrypted</span>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <button
                type="submit"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md  hover:shadow-lg w-full hover:opacity-90 transition duration-500 ease-in-out ..."
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
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeft size={16} />
                  Back to Shipping
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </FormContainer>
  )
}

export default Payment
