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
      className="my-3 p-3 rounded cursor-pointer bg-white shadow hover:shadow-md transition-shadow"
      role="button" // Makes the card feel like a clickable item (accessibility)
    >
      {/* Product Image with link to product details page */}
      <Link href={`/product/${_id}`} passHref>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-t"
        />
      </Link>

      {/* Product text details */}
      <div className="p-4">
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
