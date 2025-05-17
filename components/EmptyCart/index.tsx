"use client"
import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

const EmptyCart = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div
        className={`text-center max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="relative h-24 bg-gradient-to-r from-blue-100 to-teal-100">
          <div
            className={`absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg transition-all duration-500 transform ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <ShoppingCart size={64} className="text-gray-400" strokeWidth={1.5} />
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <h2
            className={`text-2xl font-bold text-gray-800 mb-3 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Your Cart is Empty
          </h2>

          <p
            className={`text-gray-500 mb-8 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Looks like you haven't added anything to your cart yet.
          </p>

          <div
            className={`transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href="/">
              <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full md:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue Shopping
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCart
