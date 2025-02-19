import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter to handle page URL changes
import { useProductsActions, useTypedSelector } from '../../hooks';
import { Row, Col, Button } from 'react-bootstrap';
import Item from './Item'; // Assuming Item is a component that renders individual product details
import Loader from '../Loader';
import Message from '../Message';
import ProductCarousel from '../ProductCarousel';
import Link from 'next/link';

interface ProductsInterface {
  keyword?: string;
  pageId?: string;
}

const Products: React.FC<ProductsInterface> = ({ keyword, pageId }) => {
  const { fetchProducts } = useProductsActions();
  const router = useRouter(); // Using router to handle page URL changes

  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageId || '1'));
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Fetch products when pageId or keyword changes
  useEffect(() => {
    const queryPage = router.query.pageId ? parseInt(router.query.pageId as string) : 1;
    setCurrentPage(queryPage);
    fetchProducts(keyword || '', queryPage);
  }, [fetchProducts, keyword, router.query.pageId]); // Dependency on pageId from the router

  // Append products when the API call completes
  useEffect(() => {
    if (products.length > 0) {
      // Filter out products that are already in the allProducts array
      const newProducts = products.filter((product) => 
        !allProducts.some((p) => p._id === product._id)
      );
      setAllProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }
  }, [products]);

  // Function to load more products (Show More)
  const handleShowMore = async () => {
    const nextPage = currentPage + 1;
    // Update the URL with the new pageId
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, pageId: nextPage }, // Update URL with new pageId
      },
      undefined,
      { shallow: true }
    );

    // Fetch products for the next page only if necessary
    await fetchProducts(keyword || '', nextPage);
    setCurrentPage(nextPage); // Update page state after fetch
  };

  // Function to show less products (Show Less)
  const handleShowLess = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return; // Prevent going to a negative or zero page
    // Remove the current page products from the list
    const productsToRemove = products.length;
    setAllProducts(allProducts.slice(0, allProducts.length - productsToRemove));
    setCurrentPage(prevPage); // Update page state
    // Update the URL with the new pageId without fetching data for the previous page
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, pageId: prevPage }, // Update URL with new pageId
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link href="/" passHref>
          <Button className="btn btn-light">Go back</Button>
        </Link>
      )}

      <h1>Latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {allProducts.map((product: any) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Item {...product} />
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between">
            {currentPage > 1 && (
              <Button variant="secondary" onClick={handleShowLess}>
                Show Less
              </Button>
            )}
            {currentPage < pages && (
              <Button variant="primary" onClick={handleShowMore}>
                Show More
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Products;
