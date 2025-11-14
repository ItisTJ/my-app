"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOrderActions, useShipping, useTypedSelector } from "../../hooks"
import { useBuyNowActions } from "../../hooks"
import PaymentModal from "../PaymentModal"
import { createStripeCheckoutSession } from "@/utils/stripe";
import { ArrowLeft } from "lucide-react"

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

  const { cart, buyNow } = useTypedSelector((state) => state)
  const { createOrder } = useOrderActions()
  const { clearBuyNowItem } = useBuyNowActions()

  const [calculatedShipping, setCalculatedShipping] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Detect if Buy Now is active
  const isBuyNow = !!buyNow.item

  const orderItems = isBuyNow
    ? [
        {
          productId: buyNow.item.product._id,
          name: buyNow.item.product.name,
          image: buyNow.item.product.image,
          price: buyNow.item.product.price,
          qty: buyNow.item.qty,
        },
      ]
    : cart.data.cartItems

  const itemsPrice = isBuyNow
    ? buyNow.item.qty * buyNow.item.product.price
    : cart.data.itemsPrice

  const shippingDetails = isBuyNow
    ? buyNow.item.shippingDetails || cart.data.shippingDetails
    : cart.data.shippingDetails

  const paymentMethod = isBuyNow
    ? buyNow.item.paymentMethod || cart.data.paymentMethod
    : cart.data.paymentMethod

  useEffect(() => {
    if (!shippingDetails?.city) {
      // Redirect user back to shipping page if shipping details missing
      router.push("/shipping")
      return
    }

    const city = shippingDetails.city.trim()
    const region = regions.find(
      (r) => r.name.toLowerCase() === city.toLowerCase()
    )
    if (region) {
      setCalculatedShipping(region.rate)
    } else {
      setCalculatedShipping(regions[0].rate)
    }
  }, [shippingDetails?.city, router])

  const onPlaceOrderHandler = async () => {
  if (paymentMethod === "Cash On Delivery") {
    processOrder(); // Keep existing flow for COD
  } else if (paymentMethod === "Credit Card") {
    try {
      const session = await createStripeCheckoutSession(
        orderItems.map((item : any) => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
        }))
      );
      console.log("Stripe Session:", session); // Debug
      window.location.href = session.url; // Redirect user to Stripe Checkout
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  } else {
    setShowPaymentModal(true); // Fallback (optional)
  }
};

  const processOrder = () => {
    const discount = itemsPrice > 5000 ? itemsPrice * 0.1 : 0
    const finalTotal = Number((itemsPrice - discount + calculatedShipping).toFixed(2))

    createOrder({
      paymentMethod,
      shippingDetails,
      shippingPrice: calculatedShipping,
      taxPrice: 0,
      totalPrice: finalTotal,
      itemsPrice,
      orderItems,
    })

    if (isBuyNow) {
      clearBuyNowItem() // Clear buyNow state after placing the order
    }

    router.push("/orders")
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 ">
        <div className="flex-1">
          {/* Shipping Information */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800">Shipping</h2>
            <p className="text-gray-600 mt-2">
              <strong>Address: </strong>
              {shippingDetails?.address}, {shippingDetails?.city}{" "}
              {shippingDetails?.postalCode}, {shippingDetails?.country}
            </p>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
            <p className="text-gray-600 mt-2">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
            {orderItems.length === 0 ? (
              <p className="text-red-500">No items to order</p>
            ) : (
              <div className="space-y-4 mt-4">
                {orderItems.map((item: { productId: string; name: string; image?: string; price: number; qty: number }, index: number) => (
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
        <div className="md:w-1/3 ">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            <div className="mt-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>

              {itemsPrice > 500 && (
                <div className="flex justify-between mt-2">
                  <span>Discount (10%)</span>
                  <span className="text-rose-500">-${(itemsPrice * 0.1).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mt-2">
                <span>Shipping</span>
                <span>${calculatedShipping}</span>
              </div>
              <div className="flex justify-between mt-2 font-bold">
                <span>Total</span>
                <span>
                  ${(itemsPrice - (itemsPrice > 500 ? itemsPrice * 0.1 : 0) + calculatedShipping).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onPlaceOrderHandler}
              disabled={orderItems.length === 0}
              className="secondary w-full mt-4 text-white py-3 rounded-lg hover:opacity-90 transition duration-500 ease-in-out ..."
            >
              Place Order
            </button>

            <div className="mt-4 text-left">
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to cart
                </Link>
              </div>
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
