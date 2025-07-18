"use client"

import type React from "react"
import { useCartActions, useProductsActions, useTypedSelector } from "../../hooks"
import { type FormEvent, useEffect, useState } from "react"
import Rating from "../Rating"
import Link from "next/link"
import { useBuyNowActions } from "../../hooks"
import { useRouter } from "next/navigation"
import {
  useCartActions,
  useProductsActions,
  useTypedSelector,
} from '../../hooks';
import { FormEvent, useEffect, useState } from 'react';
import Rating from '../Rating';
import Loader from '../Loader';
import Message from '../Message';
import Link from 'next/link';

// Props for the component — expecting a dynamic `pageId` from route
interface ProductDetailsProps {
  pageId: string | string[] | undefined
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ pageId }) => {
  const [qty, setQty] = useState(1)
  const [_rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [activeImage, setActiveImage] = useState(0)
  const router = useRouter()

  const { fetchProduct, createProductReview } = useProductsActions()
  const { addToCart } = useCartActions()
  const { setBuyNowItem } = useBuyNowActions()

  const { loading, error, data } = useTypedSelector((state) => state.product)
  const { loading: cartLoading } = useTypedSelector((state) => state.cart)
  const { data: user } = useTypedSelector((state) => state.user)
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = useTypedSelector((state) => state.productCreateReview)

  const { image, name, price, countInStock, description, rating, numReviews } = data

  useEffect(() => {
    if (!pageId) return
    fetchProduct(pageId as string)
  }, [fetchProduct, pageId])

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createProductReview(pageId as string, { rating: _rating, comment })
  }

  const onBuyNowHandler = () => {
    setBuyNowItem({
      product: data,
      qty,
    })
    if (!user) {
      router.push("/login?redirect=/shipping")
    } else {
      router.push("/shipping")
    }
  }

  const decrementQty = () => {
    if (qty > 1) setQty(qty - 1)
  }

  const incrementQty = () => {
    if (qty < countInStock) setQty(qty + 1)
  }

  // Mock data for thumbnail images (in a real app, these would come from the API)
  const thumbnails = [image, image, image]

  return (
    <>
      {/* Go Back button */}
      <Link href="/" passHref>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors my-3 m-4">
          Go Back
        </button>
      </Link>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
        </div>
      ) : error ? (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg shadow mb-4"
          role="alert"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <span className="font-medium text-sm">{error}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Product Images */}
            <div className="flex flex-col">
              {/* Main Image */}
              <div className="relative border border-gray-200 rounded-lg mb-3 overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-auto object-cover aspect-square transition-transform duration-500 hover:scale-105"
                />
                <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                  <span className="sr-only">Expand</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                  </svg>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className={`border ${activeImage === index ? "border-blue-500" : "border-gray-200"} rounded-lg overflow-hidden cursor-pointer flex-shrink-0 w-16 h-16`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={thumb || "/placeholder.svg"}
                      alt={`${name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-slate-700">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-slate-700">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-medium text-slate-700">Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{name}</h1>

              <div className="flex items-center gap-2 mb-3">
                <Rating value={rating} text={`${numReviews} reviews`} />
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-700">${price?.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">or</div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  3 X ${(price / 3)?.toFixed(2)} with <span className="font-semibold">Koko</span>
                  <span className="inline-block ml-1 w-3 h-3 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">
                    i
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      countInStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {countInStock > 0 ? `${countInStock} In Stock` : "Out Of Stock"}
                  </span>
                </div>
              </div>

              {/* Configuration Options */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <span className="w-16 font-medium text-sm">RAM:</span>
                  <div className="relative w-48">
                    <select className="w-full appearance-none border border-gray-300 rounded-md py-1.5 px-2 pr-6 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>8GB</option>
                      <option>12GB</option>
                      <option>16GB</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-16 font-medium text-sm">Storage:</span>
                  <div className="flex gap-1">
                    <button className="border border-gray-300 bg-white rounded-md py-1 px-2 font-medium text-xs">
                      128GB
                    </button>
                    <button className="border border-gray-300 bg-white rounded-md py-1 px-2 font-medium bg-gray-100 text-xs">
                      256GB
                    </button>
                    <button className="border border-gray-300 bg-white rounded-md py-1 px-2 font-medium text-xs">
                      512GB
                    </button>
                    <button className="text-gray-500 ml-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {countInStock > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex items-center border border-gray-300 rounded-md w-24">
                    <button
                      onClick={decrementQty}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      disabled={qty <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={qty}
                      readOnly
                      className="w-8 h-8 text-center border-x border-gray-300 focus:outline-none text-sm"
                    />
                    <button
                      onClick={incrementQty}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      disabled={qty >= countInStock}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        product: data,
                        qty,
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center text-sm"
                    disabled={countInStock === 0}
                  >
                    {cartLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add To Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={onBuyNowHandler}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center text-sm"
                    disabled={countInStock === 0}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Now
                  </button>
                </div>
              )}

              {/* Social Proof */}
              <div className="bg-gray-100 rounded-md p-3 flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-700 text-sm">59</span>
                <span className="text-gray-600 text-sm">People watching this product now!</span>
              </div>

              {/* Compare Button */}
              <button className="flex items-center gap-2 text-gray-700 font-medium mb-4 text-sm">
                <Scale className="w-4 h-4" />
                Compare
              </button>

              {/* Product Description */}
              <div className="mt-2">
                <h3 className="text-base font-medium mb-2">Description:</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
            </div>

            {data.reviews?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-medium">No reviews yet</p>
                <p className="text-slate-400 mt-1 text-sm">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {data.reviews?.map((_review) => (
                  <div
                    key={_review._id}
                    className="bg-white rounded-lg p-4 shadow border border-slate-200/50 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow">
                          <span className="text-white font-bold text-sm">{_review.name.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-900 text-sm">{_review.name}</h4>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {_review.createdAt?.substring(0, 10)}
                          </span>
                        </div>
                        <div className="mb-2">
                          <Rating value={_review.rating} />
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">{_review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Share Your Experience</h3>

              {successReview && (
                <div
                  className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 px-4 py-3 rounded-r-lg shadow mb-4"
                  role="alert"
                >
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-emerald-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-sm">Review submitted successfully!</span>
                  </div>
                </div>
              )}

              {loadingReview && (
                <div className="flex justify-center py-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200"></div>
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                </div>
              )}

              {errorReview && (
                <div
                  className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg shadow mb-4"
                  role="alert"
                >
                  <span className="font-medium text-sm">{errorReview}</span>
                </div>
              )}

              {user ? (
                <form onSubmit={onSubmitHandler} className="space-y-3">
                  <div>
                    <label htmlFor="rating" className="block mb-2 font-medium text-sm">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={_rating}
                      onChange={(e) => setRating(Number.parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select a rating...</option>
                      <option value="1">⭐ 1 - Poor</option>
                      <option value="2">⭐⭐ 2 - Fair</option>
                      <option value="3">⭐⭐⭐ 3 - Good</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block mb-2 font-medium text-sm">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                      placeholder="Share your detailed experience with this product..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
                    disabled={loadingReview}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md">
                  <span className="text-sm">
                    Please{" "}
                    <Link href="/login" className="underline font-medium">
                      sign in
                    </Link>{" "}
                    to write a review
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

export default ProductDetails
