"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: () => void
}

const PaymentModal = ({ isOpen, onClose, onPaymentComplete }: PaymentModalProps) => {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setPaymentError("")

    // Validate card details
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setPaymentError("All fields are required")
      setProcessing(false)
      return
    }

    // Simple validation for card number (16 digits)
    if (cardNumber.replace(/\s/g, "").length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ""))) {
      setPaymentError("Invalid card number")
      setProcessing(false)
      return
    }

    // Simple validation for CVV (3-4 digits)
    if (cvv.length < 3 || !/^\d+$/.test(cvv)) {
      setPaymentError("Invalid CVV")
      setProcessing(false)
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onClose()
      onPaymentComplete()
    }, 1500)
  }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative h-16 bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-between px-6">
          <h3 className="text-xl font-bold text-gray-800">Payment Details</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCardSubmit} className="p-6 space-y-4">
          {paymentError && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{paymentError}</div>}

          <div className="space-y-2">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg mt-4"
          >
            <span className="relative z-10">{processing ? "Processing..." : "Pay Now"}</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal
