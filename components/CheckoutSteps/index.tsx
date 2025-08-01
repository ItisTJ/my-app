"use client"
import Link from "next/link"
import { Check } from "lucide-react"

interface CheckoutStepsProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  return (
    <div className="flex justify-center items-center mb-8 ">
      <div className="flex items-center w-full max-w-3xl">
        {/* Step 1: Sign In */}
        <div className="flex-1">
          {step1 ? (
            <Link href="/login" className="flex flex-col items-center group">
              <div className="secondary w-10 h-10 rounded-full text-white flex items-center justify-center mb-1 shadow-md transform transition-transform duration-300 scale-95 hover:scale-100">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-800">Sign In</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-1">
                1
              </div>
              <span className="text-sm text-gray-400">Sign In</span>
            </div>
          )}
        </div>

        {/* Connector */}
        <div className={`h-1 flex-1 ${step2 ? "secondary" : "bg-gray-200"}`}></div>

        {/* Step 2: Shipping */}
        <div className="flex-1">
          {step2 ? (
            <Link href="/shipping" className="flex flex-col items-center group">
              <div className="secondary w-10 h-10 rounded-full text-white flex items-center justify-center mb-1 shadow-md transform transition-transform duration-300 scale-95 hover:scale-100">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-800">Shipping</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-1">
                2
              </div>
              <span className="text-sm text-gray-400">Shipping</span>
            </div>
          )}
        </div>

        {/* Connector */}
        <div className={`h-1 flex-1 ${step3 ? "secondary" : "bg-gray-200"}`}></div>

        {/* Step 3: Payment */}
        <div className="flex-1">
          {step3 ? (
            <Link href="/payment" className="flex flex-col items-center group">
              <div className="secondary w-10 h-10 rounded-full text-white flex items-center justify-center mb-1 shadow-md transform transition-transform duration-300 scale-95 hover:scale-100">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-800">Payment</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-1">
                3
              </div>
              <span className="text-sm text-gray-400">Payment</span>
            </div>
          )}
        </div>

        {/* Connector */}
        <div className={`h-1 flex-1 ${step3 ? "secondary" : "bg-gray-200"}`}></div>


        {/* Step 4: Place Order */}
        <div className="flex-1">
          {step4 ? (
            <Link href="/placeorder" className="flex flex-col items-center group">
              <div className="secondary w-10 h-10 rounded-full text-white flex items-center justify-center mb-1 shadow-md transform transition-transform duration-300 scale-95 hover:scale-100">
                4
              </div>
              <span className="text-sm font-medium text-gray-800">Place Order</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-1">
                4
              </div>
              <span className="text-sm text-gray-400">Place Order</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutSteps
