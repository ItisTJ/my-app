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
  // Local state for quantity selection
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState<string>(qty.toString());
  // Local state for rating input in review form
  const [_rating, setRating] = useState(0);
  // Local state for comment input in review form
  const [comment, setComment] = useState('');
  
  // Actions from custom hooks
  const { setBuyNowItem } = useBuyNowActions();
  const { fetchProduct, createProductReview } = useProductsActions();
  const { addToCart } = useCartActions();

  // Select product details from Redux store
  const { loading, error, data } = useTypedSelector(state => state.product);
  // Select loading state for cart actions
  const { loading: cartLoading } = useTypedSelector(state => state.cart);
  // Select user data from Redux store
  const { data: user } = useTypedSelector(state => state.user);
  // Select review creation state (loading, error, success)
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = useTypedSelector(state => state.productCreateReview);

  // Destructure product details for easier access
  const { image, name, price, countInStock, description, rating, numReviews } =
    data;

  // Fetch product details on initial render or when pageId changes
  useEffect(() => {
    if (!pageId) return;

    fetchProduct(pageId as string);
  }, [fetchProduct, pageId]);

  // Handler for submitting a product review
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createProductReview(pageId as string, { rating: _rating, comment });
  };

  // Handler for "Buy Now" button click
  const onBuyNowHandler = () => {
    setBuyNowItem({
      product: data,
      qty,
    });
    // Redirect user to login if not logged in, else to shipping page
    if (!user) {
      Router.push("/login?redirect=/shipping");
    } else {
      Router.push("/shipping");
    }
  };

  return (
    <>
      {/* Back link to home page */}
      <Link href="/" passHref>
        <div className="btn btn-light my-3">Go Back</div>
      </Link>

      {/* Show loader, error, or product details */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Main product details layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product image spans 1 column on medium screens */}
          <div className="md:col-span-1 flex justify-center items-start">
            <img
              src={image}
              alt={name}
              className="w-4/5 h-auto object-contain max-h-[400px]"
            />
          </div>

            {/* Product info list */}
          <div className="md:col-span-1">
            <ul className="space-y-4">
              <li>
                <h3>{name}</h3>
              </li>
              <li>
                {/* Rating component shows stars and number of reviews */}
                <Rating value={rating} text={`${numReviews} reviews`} />
              </li>
              <li>Price: ${price}</li>
              <li>
                <span>Description:</span>
                <p className="break-words whitespace-pre-wrap">{description}</p>
              </li>
            </ul>
          </div>

            {/* Purchase and stock details */}
            <div className="md:col-span-1">
              <div className="theme border rounded shadow p-4 space-y-4 max-w-sm mx-auto">
                {/* Price */}
                <div className="flex justify-between">
                  <span>Price:</span>
                  <strong>${price}</strong>
                </div>

                {/* Stock status */}
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span>{countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                </div>

                {/* Quantity selector only if in stock */}
                {countInStock > 0 && (
                  <div className="flex items-center justify-start gap-4">
                    <label htmlFor="qty">Qty</label>
                    <input
                      type="number"
                      id="qty"
                      className="border rounded px-2 py-1 w-20"
                      value={qtyInput}
                      min={1}
                      max={countInStock}
                      onFocus={() => setQtyInput('')}
                      onChange={e => {
                        const val = e.target.value;
                        // Allow only digits, empty string allowed for typing
                        if (/^\d*$/.test(val)) {
                          setQtyInput(val);
                        }
                      }}
                      onBlur={() => {
                        let numVal = parseInt(qtyInput);
                        if (isNaN(numVal) || numVal < 1) numVal = 1;
                        else if (numVal > countInStock) numVal = countInStock;
                        setQty(numVal);
                        setQtyInput(numVal.toString());
                      }}
                    />
                  </div>
                )}


                {/* Add to Cart and Buy Now buttons */}
                <div className="grid gap-2">
                  <button
                    onClick={() => {
                      addToCart({
                        product: data,
                        qty,
                      });
                    }}
                    className="ternary w-full text-white py-2 px-4 rounded disabled:opacity-50"
                    type="button"
                    disabled={countInStock === 0}
                  >
                    {cartLoading ? <Loader /> : 'Add To Cart'}
                  </button>

                  <button
                    onClick={onBuyNowHandler}
                    className="secondary w-full text-white py-2 px-4 rounded disabled:opacity-50"
                    type="button"
                    disabled={countInStock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Reviews section */}
          <div className="mt-32 md:w-1/2 mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Reviews</h2>
            {/* Show message if no reviews */}
            {data.reviews.length === 0 && <Message>No Reviews</Message>}
            <ul className="space-y-4">
              {/* List each review */}
              {data.reviews.map(_review => (
                <li key={_review._id} className="border-b pb-4">
                  <strong>{_review.name}</strong>
                  <Rating value={_review.rating} />
                  <p>{_review.createdAt?.substring(0, 10)}</p>
                  <p>{_review.comment}</p>
                </li>
              ))}
              {/* Review submission form */}
              <li>
                <h2 className="text-lg font-medium mb-2">Write a Customer Review</h2>
                {/* Show success message on successful review */}
                {successReview && (
                  <Message variant="success">
                    Review submitted successfully
                  </Message>
                )}
                {/* Show loading and error states */}
                {loadingReview && <Loader />}
                {errorReview && (
                  <Message variant="danger">{errorReview}</Message>
                )}
                {/* Show form if user logged in, else prompt to sign in */}
                {user ? (
                  <form onSubmit={onSubmitHandler} className="space-y-4">
                    <div>
                      <label htmlFor="rating" className="block font-medium">Rating</label>
                      <select
                        id="rating"
                        className="w-full border rounded px-3 py-2"
                        value={_rating}
                        onChange={e => setRating(parseInt(e.target.value))}
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
                      <label htmlFor="comment" className="block font-medium">Comment</label>
                      <textarea
                        id="comment"
                        className="w-full border rounded px-3 py-2"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex justify-center">
                      <button
                        disabled={loadingReview}
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Submit
                      </button>
                    </div>

                  </form>
                ) : (
                  <Message>
                    Please <Link href="/login">sign in</Link> to write a
                    review{' '}
                  </Message>
                )}
              </li>
            </ul>
          </div>

        </>
      )}
    </>
  );
};

export default ProductDetails;
