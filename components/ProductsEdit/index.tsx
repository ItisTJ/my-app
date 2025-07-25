// Import core libraries and custom hooks/components
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import { ProductInterface } from '../../interfaces';
import { proshopAPI } from '../../lib';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../Loader';
import Message from '../Message';
import axios from 'axios';

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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  // Local state
  const [uploading, setUploading] = useState<boolean>(false); // Uploading state for image
  const [productDetails, setDetails] = useState<Partial<ProductInterface>>(initialProduct); // Editable product details
  const [errors, setErrors] = useState<{ name?: string; brand?: string; description?: string }>({}); // Validation errors

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors: { name?: string; brand?: string; description?: string } = {};
    if (!productDetails.name) newErrors.name = 'Name is required';
    if (!productDetails.brand) newErrors.brand = 'Brand is required';
    if (!productDetails.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission to update the product
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      updateProduct(pageId as string, productDetails);
    }
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust height when content or component loads
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [productDetails.description]);

  // Check if form is valid to enable/disable submit button
  const isFormValid = productDetails.name && productDetails.brand && productDetails.description;

  return (
    <div className="min-h-screen bg-transparent flex-col items-center justify-center">
      <div className="ternary max-w-xl w-screen mx-auto 
        rounded-xl shadow-2xl 
        backdrop-blur-md bg-white/40 
        border-[1px] border-opacity-10
        p-6">
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
                  onChange={e => {
                    setDetails({ ...productDetails, name: e.target.value });
                    setErrors({ ...errors, name: e.target.value ? '' : 'Name is required' });
                  }}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Product Price */}
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  min="0"
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
                  onChange={e => {
                    setDetails({ ...productDetails, brand: e.target.value });
                    setErrors({ ...errors, brand: e.target.value ? '' : 'Brand is required' });
                  }}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>

              {/* Count in Stock */}
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700">Count In Stock</label>
                <input
                  type="number"
                  placeholder="Enter countInStock"
                  min="0"
                  value={productDetails.countInStock}
                  onChange={e => setDetails({ ...productDetails, countInStock: parseInt(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="py-2">
                <label className="inline-block text-sm font-medium text-gray-700">Category</label>
                <a
                  href="/admin/categories"
                  className="inline-block ml-2 bg-gray-900 text-xs text-gray-100 font-semibold py-1 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  Manage Categories
                </a>

                <select
                  value={productDetails.category}
                  onChange={e => setDetails({ ...productDetails, category: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="" className='text-gray-300 text-center'>Select a category</option>
                  
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  ref={textareaRef}
                  placeholder="Enter description"
                  value={productDetails.description}
                  onChange={e => {
                    setDetails({ ...productDetails, description: e.target.value });
                    setErrors({ ...errors, description: e.target.value ? '' : 'Description is required' });
                  }}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  rows={1}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none overflow-hidden"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className="secondary w-full hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
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