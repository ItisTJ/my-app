"use client"
import { type FormEvent, useState } from "react"
import { useAuth, useCartActions, useTypedSelector } from "../../hooks"
import CheckoutSteps from "../CheckoutSteps"
import { useRouter } from "next/router"
import Message from "../Message"
import { MapPin, Building, Mail, Globe, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const Shipping = () => {
  useAuth()

  const router = useRouter()

  const {
    data: { shippingDetails },
    error,
  } = useTypedSelector((state) => state.cart)
  const { saveShippingAddress } = useCartActions()

  const [shippingAddress, setShippingAddress] = useState(shippingDetails)
  const [message, setMessage] = useState<string | null | string[]>(error)

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { address, country, city, postalCode } = shippingAddress

    if (address.length < 1 || country.length < 1 || city.length < 1 || postalCode.length < 1) {
      setMessage("All fields are required.")
      return null
    }

    saveShippingAddress(shippingAddress)
    router.push("/payment")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl">
        <div className="relative h-24 bg-gradient-to-r from-blue-100 to-teal-100">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <MapPin size={32} className="text-gray-700" strokeWidth={1.5} />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <CheckoutSteps step1 step2 />

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Shipping Details</h1>

          {message && (
            <div className="mb-6">
              <Message variant="danger">{Array.isArray(message) ? message[0] : message}</Message>
            </div>
          )}

          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="address" className="mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={18} />
                </div>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 text-sm font-medium text-gray-700">
                City
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Building size={18} />
                </div>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="postalCode" className="mb-2 text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="Enter your postal code"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="country" className="mb-2 text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={18} />
                </div>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter your country"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: e.target.value,
                    })
                  }
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  Continue to Payment
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Cart
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Shipping
