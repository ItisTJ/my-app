// Import core libraries and custom hooks/components
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import { ProductInterface } from '../../interfaces';
import { proshopAPI } from '../../lib';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../Loader';
import Message from '../Message';

// Props interface to accept the product ID from the route or parent component
interface ProductsEditProps {
  pageId: string | string[] | undefined;
}

// Main component to handle product editing in admin panel
const ProductsEdit: React.FC<ProductsEditProps> = ({ pageId }) => {
  // Hook to ensure only admin can access this component
  useAdmin();

  // Initial values for a blank product form
  const initialProduct = {
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    numReviews: 0,
    countInStock: 0,
    description: '',
  };

  // Redux state and actions
  const { data, loading, error } = useTypedSelector(state => state.product);
  const { fetchProduct, updateProduct } = useProductsActions();

  // Local state
  const [uploading, setUploading] = useState<boolean>(false); // Uploading state for image
  const [productDetails, setDetails] = useState<Partial<ProductInterface>>(initialProduct); // Editable product details

  // Fetch the product to edit when pageId changes
  useEffect(() => {
    fetchProduct(pageId as string);
  }, [fetchProduct, pageId]);

  // Set the product form state when the fetched product data becomes available
  useEffect(() => {
    if (data) {
      setDetails({
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        countInStock: data.countInStock,
        description: data.description,
        image: data.image,
      });
    }
  }, [data]);

  // Handle form submission to update the product
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProduct(pageId as string, productDetails);
  };

  // Handle image upload via multipart/form-data
  const uploadFileHandler = async (e: ChangeEvent<any>) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await proshopAPI.post('/api/upload', formData, config);
      setDetails({ ...productDetails, image: data }); // Update image field with uploaded URL
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <div className=" bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md mx-auto">
        <div className="px-8 py-6">

          {/* Go back to admin product list */}
          <Link href="/admin/products" passHref>
            <button className="group mb-6 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
              <FaArrowLeft className="mr-2 inline transform transition-transform duration-300 group-hover:-translate-x-1" /> Back
            </button>
          </Link>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Product</h2>

            {/* Conditional rendering: loader, error message or form */}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <form onSubmit={onSubmitHandler} className="space-y-4 pb-8">
                {/* Product Name */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={productDetails.name}
                    onChange={e => setDetails({ ...productDetails, name: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Product Price */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={productDetails.price}
                    onChange={e => setDetails({ ...productDetails, price: parseInt(e.target.value) })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={uploadFileHandler}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  {uploading && <Loader />} {/* Show loader during image upload */}
                </div>

                {/* Brand */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    placeholder="Enter brand"
                    value={productDetails.brand}
                    onChange={e => setDetails({ ...productDetails, brand: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Count in Stock */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Count In Stock</label>
                  <input
                    type="number"
                    placeholder="Enter countInStock"
                    value={productDetails.countInStock}
                    onChange={e => setDetails({ ...productDetails, countInStock: parseInt(e.target.value) })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={productDetails.category}
                    onChange={e => setDetails({ ...productDetails, category: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={productDetails.description}
                    onChange={e => setDetails({ ...productDetails, description: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  Update
                </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductsEdit;
