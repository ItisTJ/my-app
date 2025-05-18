// Import dependencies and required hooks/components
import { v4 as randomID } from 'uuid';
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
  pageId: string | string[] | undefined;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ pageId }) => {
  // Local states for quantity, review rating, and review comment
  const [qty, setQty] = useState(1);
  const [_rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Redux actions
  const { fetchProduct, createProductReview } = useProductsActions();
  const { addToCart } = useCartActions();

  // Redux store state slices
  const { loading, error, data } = useTypedSelector(state => state.product);
  const { loading: cartLoading } = useTypedSelector(state => state.cart);
  const { data: user } = useTypedSelector(state => state.user);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = useTypedSelector(state => state.productCreateReview);

  // Destructure product details
  const { image, name, price, countInStock, description, rating, numReviews } = data;

  // Fetch product details on mount or pageId change
  useEffect(() => {
    if (!pageId) return;
    fetchProduct(pageId as string);
  }, [fetchProduct, pageId]);

  // Submit handler for review form
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProductReview(pageId as string, { rating: _rating, comment });
  };

  return (
    <>
      {/* Go Back button */}
      <Link href="/" passHref>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors my-3">
          Go Back
        </button>
      </Link>

      {/* Conditional UI rendering: loader, error, or product detail */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Product detail layout in 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left: product image */}
            <div className="md:col-span-1">
              <img src={image} alt={name} className="w-full h-96 object-cover rounded" />
            </div>

            {/* Center: product info */}
            <div className="md:col-span-1">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{name}</h3>
                <div>
                  <Rating value={rating} text={`${numReviews} reviews`} />
                </div>
                <p className="text-lg">Price: ${price}</p>
                <p className="text-lg">Description: {description}</p>
              </div>
            </div>

            {/* Right: cart panel */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded p-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-bold">${price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span>{countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                  </div>

                  {/* Show quantity selector if in stock */}
                  {countInStock > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Qty</span>
                      <select
                        value={qty}
                        onChange={e => setQty(parseInt(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {[...Array(countInStock).keys()].map(x => (
                          <option key={randomID()} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Add to Cart button */}
                  <button
                    onClick={() => {
                      addToCart({
                        product: data,
                        qty,
                      });
                    }}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={countInStock === 0}
                  >
                    {cartLoading ? (
                      <Loader options={{ width: '25px', height: '25px' }} />
                    ) : (
                      <>Add To Cart</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>

              {/* No reviews message */}
              {data.reviews.length === 0 && <Message>No Reviews</Message>}

              <div className="space-y-4">
                {/* Display each review */}
                {data.reviews.map(_review => (
                  <div key={_review._id} className="border-b pb-2">
                    <strong className="block">{_review.name}</strong>
                    <Rating value={_review.rating} />
                    <p className="text-sm text-gray-500">
                      {_review.createdAt?.substring(0, 10)}
                    </p>
                    <p>{_review.comment}</p>
                  </div>
                ))}

                {/* Review submission form */}
                <div className="border-t pt-4">
                  <h2 className="text-2xl font-bold mb-4">Write a Customer Review</h2>

                  {/* Success, error, and loader feedback */}
                  {successReview && (
                    <Message variant="success">Review submitted successfully</Message>
                  )}
                  {loadingReview && <Loader />}
                  {errorReview && <Message variant="danger">{errorReview}</Message>}

                  {/* Conditional: form shown only if user is logged in */}
                  {user ? (
                    <form onSubmit={onSubmitHandler} className="space-y-4">
                      {/* Rating selector */}
                      <div>
                        <label className="block text-sm font-medium">Rating</label>
                        <select
                          value={_rating}
                          onChange={e => setRating(parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>

                      {/* Comment textarea */}
                      <div>
                        <label className="block text-sm font-medium">Comment</label>
                        <textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          className="w-full p-2 border rounded"
                        ></textarea>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loadingReview}
                      >
                        Submit
                      </button>
                    </form>
                  ) : (
                    <Message>
                      Please <Link href="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
