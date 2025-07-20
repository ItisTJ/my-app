import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import { useRouter } from 'next/router';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6';

// Interface for individual product data
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
}

// Props for the ProductsList component
interface ProductListProps {
  pageId?: string;
}

// Functional component to list products
const ProductsList: React.FC<ProductListProps> = ({ pageId }) => {
  // Hook to ensure only admins can access this component
  useAdmin();

  // Destructure product-related actions
  const { fetchProducts, deleteProduct, createProduct } = useProductsActions();

  // Select product state from Redux store
  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector((state) => state.products);

  // Select product delete state
  const { success: successDelete } = useTypedSelector((state) => state.productDelete);

  const router = useRouter();

  // State to track current page and all loaded products
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageId || '1'));
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Effect to fetch all products up to current page on mount or when pageId changes
  useEffect(() => {
    const queryPage = router.query.pageId ? parseInt(router.query.pageId as string) : 1;
    setCurrentPage(queryPage);

    const fetchAllPages = async () => {
      for (let i = 1; i <= queryPage; i++) {
        await fetchProducts('', i);
      }
    };

    fetchAllPages();
  }, [fetchProducts, router.query.pageId]);

  // Effect to append new products to the list, avoiding duplicates
  useEffect(() => {
    if (products.length > 0) {
      const newProducts = products.filter((product) => !allProducts.some((p) => p._id === product._id));
      setAllProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }

    // If on the first page, just replace all products
    if (currentPage === 1) {
      setAllProducts(products);
    }
  }, [products, currentPage]);

  // Effect to refetch all products when a product is successfully deleted
  useEffect(() => {
    if (successDelete) {
      setAllProducts([]);
      const fetchAllPages = async () => {
        for (let i = 1; i <= currentPage; i++) {
          await fetchProducts('', i);
        }
      };
      fetchAllPages();
    }
  }, [successDelete, fetchProducts, currentPage]);

  // Handler to load next page of products
  const handleShowMore = async () => {
    const nextPage = currentPage + 1;
    router.push(
      { pathname: router.pathname, query: { ...router.query, pageId: nextPage } },
      undefined,
      { shallow: true }
    );
    await fetchProducts('', nextPage);
    setCurrentPage(nextPage);
  };

  // Handler to show previous page's products
  const handleShowLess = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return;

    const productsToRemove = products.length;
    setAllProducts(allProducts.slice(0, allProducts.length - productsToRemove));
    setCurrentPage(prevPage);

    router.push(
      { pathname: router.pathname, query: { ...router.query, pageId: prevPage } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {/* Header with page title and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Products</h1>
        <button
          onClick={createProduct}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Create Product
        </button>
      </div>

      {/* Display loader, error or product table */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Products table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">NAME</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">PRICE</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">CATEGORY</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">BRAND</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">IN STOCK</th>
                  <th className="border border-gray-300 px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {/* Render each product row */}
                {allProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{product._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-300 px-4 py-2">${product.price}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.countInStock}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      {/* Edit button */}
                      <Link href={`/admin/products/edit/${product._id}`} passHref>
                        <button className="bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      {/* Delete button with confirmation */}
                      <button
                        className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product._id);
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center gap-4 mt-4">
            {currentPage > 1 && (
              <button
                className="group flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                onClick={handleShowLess}
              >
                Show Less
                <FaAngleUp className="transform transition-transform duration-200 group-hover:scale-150" />
              </button>
            )}
            {currentPage < pages && (
              <button
                className="group flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={handleShowMore}
              >
                Show More
                <FaAngleDown className="transform transition-transform duration-200 group-hover:scale-150" />
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductsList;
