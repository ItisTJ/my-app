// Import necessary hooks, components, and utilities
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProductsActions, useTypedSelector } from '../../hooks';
import Item from './Item'; // Product card component
import Loader from '../Loader'; // Loader UI
import Message from '../Message'; // Error message UI
import Link from 'next/link';
import { FaAngleUp,FaAngleDown,FaArrowLeft } from 'react-icons/fa6';


// Interface for props passed to the Products component
interface ProductsInterface {
  keyword?: string;  // Optional keyword for filtering products
  pageId?: string;   // Optional page number for pagination
}

// Functional component to render a paginated and optionally filtered list of products
const Products: React.FC<ProductsInterface> = ({ keyword, pageId }) => {
  const { fetchProducts } = useProductsActions(); // Redux action to fetch products
  const router = useRouter(); // Next.js router for navigation and URL state

  // Destructure product-related state from Redux store
  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector((state) => state.products);

  // State to track current page and accumulated list of products
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageId || '1'));
  const [allProducts, setAllProducts] = useState<any[]>([]); // Holds all loaded products (infinite-scroll-like)

  // Effect: Fetch products when keyword or pageId changes
  useEffect(() => {
    const queryPage = router.query.pageId ? parseInt(router.query.pageId as string) : 1;
    setCurrentPage(queryPage);
    fetchProducts(keyword || '', queryPage); // Trigger Redux fetch
  }, [fetchProducts, keyword, router.query.pageId]);

  // Effect: Add new products to allProducts only if they're not already present
  useEffect(() => {
    if (products.length > 0) {
      const newProducts = products.filter((product) => 
        !allProducts.some((p) => p._id === product._id)
      );
      setAllProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }
  }, [products]);

  // Handle "Show More" button: go to next page and fetch more products
  const handleShowMore = async () => {
    const nextPage = currentPage + 1;
    router.push(
      { pathname: router.pathname, query: { ...router.query, pageId: nextPage } },
      undefined,
      { shallow: true } // Prevent full page reload
    );
    await fetchProducts(keyword || '', nextPage);
    setCurrentPage(nextPage);
  };

  // Handle "Show Less" button: remove last batch of products and decrement page
  const handleShowLess = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return;

    const productsToRemove = products.length; // Remove the last fetched batch
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
      {/* Optional "Go Back" button if search keyword exists */}
      {keyword && (
        <Link href="/" passHref>
          <button className="group m-6 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
            <FaArrowLeft className="mr-2 inline transform transition-transform duration-300 group-hover:-translate-x-1" /> Back
          </button>
        </Link>
      )}

      <h1 className="text-2xl font-bold my-4">Latest products</h1>

      {/* Conditional rendering based on loading/error states */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.map((product: any) => (
              <div key={product._id} className="w-full">
                <Item {...product} /> {/* Render each product using Item component */}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-4 mb-8">
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

export default Products;
