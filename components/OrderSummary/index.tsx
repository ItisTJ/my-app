"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOrderActions, useShipping, useTypedSelector } from "../../hooks"
import PaymentModal from "../PaymentModal"

// Region interface for shipping calculation
interface Region {
  name: string
  distance: number
  rate: number
}

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
  { name: "Batticaloa", distance: 300, rate: 600 },
  { name: "Trincomalee", distance: 260, rate: 600 },  
  { name: "Anuradhapura", distance: 205, rate: 500 },
  { name: "Polonnaruwa", distance: 220, rate: 550 },
  { name: "Kurunegala", distance: 95, rate: 350 },
  { name: "Ratnapura", distance: 100, rate: 400 },
  { name: "Badulla", distance: 200, rate: 500 },
  { name: "Ampara", distance: 300, rate: 600 },
  { name: "Mannar", distance: 350, rate: 650 },
  { name: "Vavuniya", distance: 250, rate: 600 },
  { name: "Kilinochchi", distance: 400, rate: 700 },
  { name: "Mullaitivu", distance: 450, rate: 750 },
  { name: "Puttalam", distance: 120, rate: 400 },
  { name: "Moneragala", distance: 150, rate: 450 },
  { name: "Kegalle", distance: 60, rate: 350 },

]

const OrderSummaryContent = () => {
  useShipping()
  const router = useRouter()

  const { cart } = useTypedSelector((state) => state)
  const { error } = useTypedSelector((state) => state.order)
  const { createOrder } = useOrderActions()

  const [calculatedShipping, setCalculatedShipping] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    if (cart.data?.shippingDetails?.city) {
      const city = cart.data.shippingDetails.city.trim()
      const region = regions.find(
        (r) => r.name.toLowerCase() === city.toLowerCase()
      )
      if (region) {
        setCalculatedShipping(region.rate)
      } else {
        setCalculatedShipping(regions[0].rate)
      }
    }
  }, [cart.data.shippingDetails?.city])

  const onPlaceOrderHandler = () => {
    const { paymentMethod } = cart.data

    if (paymentMethod === "Cash On Delivery") {
      processOrder()
    } else {
      setShowPaymentModal(true)
    }
  }

  const processOrder = () => {
    const { itemsPrice, cartItems, paymentMethod, shippingDetails } = cart.data
    const discount = itemsPrice > 500 ? itemsPrice * 0.1 : 0
    const finalTotal = Number((itemsPrice - discount + calculatedShipping).toFixed(2))

    createOrder({
      paymentMethod,
      shippingDetails,
      shippingPrice: calculatedShipping,
      taxPrice: 0,
      totalPrice: finalTotal,
      itemsPrice,
      orderItems: cartItems,
      discount: Number(discount.toFixed(2)),
    })

    router.push("/orders")
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Shipping Information */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800">Shipping</h2>
            <p className="text-gray-600 mt-2">
              <strong>Address: </strong>
              {cart.data.shippingDetails.address}, {cart.data.shippingDetails.city}{" "}
              {cart.data.shippingDetails.postalCode}, {cart.data.shippingDetails.country}
            </p>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
            <p className="text-gray-600 mt-2">
              <strong>Method: </strong>
              {cart.data.paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
            {cart.data.cartItems.length === 0 ? (
              <p className="text-red-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4 mt-4">
                {cart.data.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <Link href={`/product/${item.productId}`} passHref>
                        <span className="ml-4 text-blue-600 hover:underline">{item.name}</span>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>
                        {item.qty} x ${item.price}
                      </span>
                      <span>= ${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            <div className="mt-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${cart.data.itemsPrice}</span>
              </div>

              {cart.data.itemsPrice > 500 && (
                <div className="flex justify-between mt-2">
                  <span>Discount (10%)</span>
                  <span className="text-rose-500">-${(cart.data.itemsPrice * 0.1).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mt-2">
                <span>Shipping</span>
                <span>${calculatedShipping}</span>
              </div>
              <div className="flex justify-between mt-2 font-bold">
                <span>Total</span>
                <span>
                  ${(
                    cart.data.itemsPrice - (cart.data.itemsPrice > 500 ? cart.data.itemsPrice * 0.1 : 0) +
                    calculatedShipping
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onPlaceOrderHandler}
              disabled={cart.data.cartItems.length === 0}
              className="w-full mt-4 bg-gradient-to-r from-blue-950 to-teal-500 text-white py-3 rounded-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={processOrder}
      />
    </>
  )
}

export default OrderSummaryContent
