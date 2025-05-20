"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCartActions, useTypedSelector } from "../../hooks"
import Link from "next/link"
import Image from "next/image"
import { v4 as randomID } from "uuid"
import Message from "../Message"
import EmptyCart from "../EmptyCart"
import Loader from "../Loader"
import { useRouter } from "next/router"
import { MinusIcon, PlusIcon, XIcon, ArrowLeftIcon, ShoppingBag } from "lucide-react"

interface CartItem {
  productId: string
  image: string
  name: string
  price: number
  qty: number
  countInStock: number
}

const Cart: React.FC = () => {
  const router = useRouter()

  const [showNotification, setShowNotification] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    loading,
    error,
    data: { cartItems },
  } = useTypedSelector((state) => state.cart)
  const { data } = useTypedSelector((state) => state.user)
  const { addToCart, removeFromCart } = useCartActions()

  // Handle notification animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (showNotification) {
      setNotificationVisible(true)
    } else {
      timeoutId = setTimeout(() => {
        setNotificationVisible(false)
      }, 500) // Match this with the CSS transition duration
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [showNotification])

  const onCheckoutHandler = () => {
    const redirect = data ? "/shipping" : "/login"
    router.push(redirect)
  }

  const handleQuantityChange = async (productId: string, newQty: number) => {
    setIsUpdating(true)

    if (newQty === 0) {
      // Remove the item completely when quantity is zero
      await removeFromCart(productId)
    } else {
      await addToCart({ qty: newQty, productId })
    }

    setIsUpdating(false)
    setShowNotification(true)

    // Refresh the cart data
    router.replace(router.asPath)

    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  const itemsCount = cartItems.reduce((acc: number, item: CartItem) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.qty * item.price, 0)

  // Apply discount only if subtotal is greater than $500
  const discount = subtotal > 500 ? subtotal * 0.1 : 0
  const total = subtotal - discount // Total is just subtotal minus discount at this stage

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative bg-gray-50">
      {notificationVisible && (
        <div className="max-w-7xl mx-auto mb-6 fixed top-4 right-4 z-50 transition-opacity duration-500 opacity-100">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg shadow-lg flex items-center">
            <span className="mr-2 bg-white text-teal-600 rounded-full w-6 h-6 flex items-center justify-center">✓</span>
            <span className="font-bold">Cart updated.</span>
          </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-gray-800 hover:text-gray-600 group">
          <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-5">
                    <span className="text-gray-500 font-medium">Product</span>
                  </div>
                  <div className="col-span-4 flex justify-center">
                    <span className="text-gray-500 font-medium">Quantity</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-gray-500 font-medium">Price</span>
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader />
                </div>
              ) : error ? (
                <div className="p-6">
                  <Message variant="danger">{error}</Message>
                </div>
              ) : (
                cartItems.map((item: CartItem, index: number) => (
                  <div
                    key={randomID()}
                    className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-5 flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-teal-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-span-4 flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            className="p-2 text-gray-500 hover:text-blue-950 transition-colors disabled:opacity-50"
                            onClick={() => handleQuantityChange(item.productId, item.qty - 1)}
                            disabled={item.qty < 0 || isUpdating} // Allow qty to go down to 0
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.qty}</span>
                          <button
                            className="p-2 text-gray-500 hover:text-teal-500 transition-colors disabled:opacity-50"
                            onClick={() =>
                              item.qty < item.countInStock && handleQuantityChange(item.productId, item.qty + 1)
                            }
                            disabled={item.qty >= item.countInStock || isUpdating}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-gray-900 text-right font-medium">
                        ${item.price.toLocaleString()}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-950 transition-colors"
                          onClick={() => removeFromCart(item.productId)}
                          disabled={isUpdating}
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Discount (10%)</span>
                  <span className="font-medium text-rose-500">-${discount.toLocaleString()}</span>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Shipping will be calculated at checkout</p>
                </div>
              </div>

              <button
                type="button"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
                onClick={onCheckoutHandler}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  Proceed to Checkout
                  <ShoppingBag size={16} className="transition-transform duration-300 group-hover:translate-y-[-2px]" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors inline-flex items-center"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
