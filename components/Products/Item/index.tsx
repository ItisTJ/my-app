// Import required types and components
import { ProductInterface } from '../../../interfaces'; // Interface for typing product props
import Link from 'next/link'; // Next.js component for client-side navigation
import Rating from '../../Rating'; // Reusable Rating component

// Item component that displays a single product's summary (image, name, rating, price)
const Item: React.FC<ProductInterface> = ({
  _id,
  image,
  name,
  rating,
  numReviews,
  price,
}) => {
  return (
    // Main container for the product card
    <div
      className=" my-3 p-3 rounded  cursor-pointer bg-white shadow hover:shadow-md transition-shadow h-full"
      role="button" // Makes the card feel like a clickable item (accessibility)
    >
      {/* Product Image with link to product details page */}
      <div className="h-64 w-full flex flex-col items-center overflow-hidden">
        <Link href={`/product/${_id}`} passHref className='mt-auto mb-auto'>
          <img
            src={image}
            alt={name}
            className="w-64 object-cover rounded-t" // set fixed width
          />
        </Link>
      </div>

      {/* Product text details */}
      <div className=" flex flex-col items-center justify-between pt-auto pb-0">
        {/* Product Name with link to product details */}
        <Link href={`/product/${_id}`} passHref>
          <h3 className="text-lg font-bold">
            {name}
          </h3>
        </Link>

        {/* Product Rating with number of reviews */}
        <div className="my-3">
          <Rating value={rating} text={`${numReviews} reviews`} />
        </div>

        {/* Product Price */}
        <h3 className="text-xl font-semibold py-1">
          ${price}
        </h3>
      </div>
    </div>
  );
};

export default Item;
