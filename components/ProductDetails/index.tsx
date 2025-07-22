"use client"

import type React from "react"

import { v4 as randomID } from "uuid"
import { useBuyNowActions, useCartActions, useProductsActions, useTypedSelector } from "../../hooks"
import { type FormEvent, useEffect, useState } from "react"
import Rating from "../Rating"
import Loader from "../Loader"
import Message from "../Message"
import Link from "next/link"
import Router from "next/router"
import { ArrowLeft, ShoppingCart } from "lucide-react"

interface ProductDetailsProps {
  pageId: string | string[] | undefined
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ pageId }) => {
  const [qty, setQty] = useState(1)
  const [_rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const { setBuyNowItem } = useBuyNowActions()
  const { fetchProduct, createProductReview } = useProductsActions()
  const { addToCart } = useCartActions()
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
      Router.push("/login?redirect=/shipping")
    } else {
      Router.push("/shipping")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Link href="/" passHref>
        <div className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </div>
      </Link>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="space-y-8">
          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <img src={image || "/placeholder.svg"} alt={name} className="w-full h-auto rounded-lg border" />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Rating value={rating} text={`${numReviews} reviews`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-4">${price}</div>
              </div>

              <div>
                <p className="text-gray-600">{description}</p>
              </div>

              {/* Purchase Options */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${countInStock > 0 ? "text-teal-500" : "text-red-600"}`}>
                    {countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </span>
                </div>

                {countInStock > 0 && (
                  <div className="flex items-center justify-between">
                    <label htmlFor="quantity" className="text-sm text-gray-600">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={qty}
                      onChange={(e) => setQty(Number.parseInt(e.target.value))}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {[...Array(countInStock).keys()].map((x) => (
                        <option key={randomID()} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      addToCart({
                        product: data,
                        qty,
                      })
                    }}
                    disabled={countInStock === 0}
                    className="flex-1 border-1 border-black-500  bg-transparen hover:bg-gray-100 transition duration-500 ease-in-out ... disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    {cartLoading ? (
                      <Loader options={{ width: "16px", height: "16px" }} />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={onBuyNowHandler}
                    disabled={countInStock === 0}
                    className="flex-1 bg-gradient-to-r from-blue-950 to-teal-500 hover:cursor-pointer hover:opacity-75 transition duration-500 ease-in-out ... disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>

            {data.reviews.length === 0 ? (
              <p className="text-gray-500 py-8">No reviews yet</p>
            ) : (
              <div className="space-y-6 mb-8">
                {data.reviews.map((_review) => (
                  <div key={_review._id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{_review.name}</h4>
                        <Rating value={_review.rating} />
                      </div>
                      <span className="text-sm text-gray-500">{_review.createdAt?.substring(0, 10)}</span>
                    </div>
                    <p className="text-gray-700">{_review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>

              {successReview && (
                <div className="mb-4">
                  <Message variant="success">Review submitted successfully</Message>
                </div>
              )}

              {loadingReview && (
                <div className="mb-4">
                  <Loader />
                </div>
              )}

              {errorReview && (
                <div className="mb-4">
                  <Message variant="danger">{errorReview}</Message>
                </div>
              )}

              {user ? (
                <form onSubmit={onSubmitHandler} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={_rating}
                      onChange={(e) => setRating(Number.parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="bg-gradient-to-r from-blue-950 to-teal-500 hover:cursor-pointer hover:opacity-75 transition duration-500 ease-in-out ... disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded transition-colors"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <p className="text-gray-600">
                  Please{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    sign in
                  </Link>{" "}
                  to write a review
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
