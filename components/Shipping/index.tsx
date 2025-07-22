"use client"
import { type FormEvent, useState } from "react"
import { useAuth, useCartActions, useTypedSelector } from "../../hooks"
import CheckoutSteps from "../CheckoutSteps"
import { useRouter } from "next/router"
import Message from "../Message"
import { MapPin, Building, Mail, Globe, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const districtsOfSriLanka = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
]

const countries = ["Sri Lanka"]

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
              <input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:cursor-pointer hover:bg-gray-100
"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 text-sm font-medium text-gray-700">
                City
              </label>
              <select
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:cursor-pointer hover:bg-gray-100
"
              >
                <option value="">Select your city</option>
                {districtsOfSriLanka.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="country" className="mb-2 text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:cursor-pointer hover:bg-gray-100
"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="postalCode" className="mb-2 text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                placeholder="Enter your postal code"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:cursor-pointer hover:bg-gray-100
"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white rounded-lg hover:cursor-pointer hover:opacity-90 transition duration-500 ease-in-out ...">
                Continue to Payment
              </button>
            </div>

            <div className="mt-4 text-left">
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to cart
                </Link>
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Shipping