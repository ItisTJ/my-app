import { v4 as randomID } from 'uuid';
import {
  useBuyNowActions,
  useCartActions,
  useProductsActions,
  useTypedSelector,
} from '../../hooks';
import { FormEvent, useEffect, useState } from 'react';
import Rating from '../Rating';
import Loader from '../Loader';
import Message from '../Message';
import Link from 'next/link';
import Router from 'next/router';

interface ProductDetailsProps {
  pageId: string | string[] | undefined; // The ID of the product to fetch and display
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ pageId }) => {
  const [qty, setQty] = useState(1);
  const [_rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { setBuyNowItem } = useBuyNowActions();
  const { fetchProduct, createProductReview } = useProductsActions();
  const { addToCart } = useCartActions();

  const { loading, error, data } = useTypedSelector(state => state.product);
  const { loading: cartLoading } = useTypedSelector(state => state.cart);
  const { data: user } = useTypedSelector(state => state.user);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = useTypedSelector(state => state.productCreateReview);

  const { image, name, price, countInStock, description, rating, numReviews } = data;

  useEffect(() => {
    if (!pageId) return;
    fetchProduct(pageId as string);
  }, [fetchProduct, pageId]);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProductReview(pageId as string, { rating: _rating, comment });
  };

  const onBuyNowHandler = () => {
    setBuyNowItem({
      product: data,
      qty,
    });
    if (!user) {
      Router.push("/login?redirect=/shipping");
    } else {
      Router.push("/shipping");
    }
  };

  return (
    <>
      <Link href="/" passHref>
        <div className="btn btn-light my-3">Go Back</div>
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Product Image */}
            <div className="flex justify-center items-center">
              <img
                src={image}
                alt={name}
                className="w-4/5 h-auto object-contain max-h-[400px]"
              />
            </div>

            {/* Product Details */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Top Row: Name and Action Section */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                {/* Left: Name, Rating, Description */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <Rating value={rating} text={`${numReviews} reviews`} />
                  <p className="text-xl font-semibold">Price: ${price}</p>
                  <div>
                    <h4 className="font-medium">Description:</h4>
                    <p className="break-words whitespace-pre-wrap">{description}</p>
                  </div>
                </div>

                {/* Right: Status, Quantity, Buttons */}
                <div className="flex flex-col gap-3 border p-4 rounded-md shadow-sm w-full md:w-1/2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        countInStock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </span>
                  </div>

                  {countInStock > 0 && (
                    <div className="flex justify-between items-center">
                      <label htmlFor="quantity" className="text-gray-600">
                        Quantity:
                      </label>
                      <select
                        id="quantity"
                        value={qty}
                        onChange={e => setQty(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {[...Array(countInStock).keys()].map(x => (
                          <option key={randomID()} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Inline Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart({ product: data, qty })}
                      disabled={countInStock === 0}
                      className="flex-1 border-1 border-black-500  bg-transparen hover:bg-gray-100 transition duration-500 ease-in-out ... disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      {cartLoading ? <Loader /> : 'Add To Cart'}
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
          </div>

          {/* Reviews Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {data.reviews.length === 0 ? (
              <Message>No Reviews</Message>
            ) : (
              <ul className="space-y-4">
                {data.reviews.map(_review => (
                  <li key={_review._id} className="border-b pb-4">
                    <strong>{_review.name}</strong>
                    <Rating value={_review.rating} />
                    <p className="text-sm text-gray-500">
                      {_review.createdAt?.substring(0, 10)}
                    </p>
                    <p>{_review.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Review Form */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Write a Customer Review</h3>
              {successReview && (
                <Message variant="success">Review submitted successfully</Message>
              )}
              {loadingReview && <Loader />}
              {errorReview && <Message variant="danger">{errorReview}</Message>}
              {user ? (
                <form onSubmit={onSubmitHandler} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block font-medium">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={_rating}
                      onChange={e => setRating(Number(e.target.value))}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select...</option>
                      <option value="1">★ - Poor</option>
                      <option value="2">★★ - Fair</option>
                      <option value="3">★★★ - Good</option>
                      <option value="4">★★★★ - Very Good</option>
                      <option value="5">★★★★★ - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block font-medium">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    ></textarea>
                  </div>
                  <div className="flex justify-start">
                    <button
                      disabled={loadingReview}
                      type="submit"
                      className="bg-gradient-to-r from-blue-950 to-teal-500 hover:cursor-pointer hover:opacity-75 transition duration-500 ease-in-out ... disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded transition-colors"
                    >
                      Submit
                    </button>
                  </div>
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
        </>
      )}
    </>
  );
};

export default ProductDetails;
