import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import Paginate from '../Paginate';

interface ProductListProps {
  pageId?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
}

const ProductsList: React.FC<ProductListProps> = ({ pageId }) => {
  useAdmin();

  const { fetchProducts, deleteProduct, createProduct } = useProductsActions();

  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector(state => state.products);

  const { success: successDelete } = useTypedSelector(
    state => state.productDelete
  );

  // State to store loaded products
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Initializing with an empty array
  const [currentPage, setCurrentPage] = useState(parseInt(pageId || '1'));
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Flag to track loading state when loading more products

  useEffect(() => {
    // Fetch products on initial load or page change
    fetchProducts('', currentPage);
  }, [fetchProducts, successDelete, currentPage]);

  useEffect(() => {
    if (products.length > 0) {
      setAllProducts((prevProducts) => [...prevProducts, ...products]); // Append new products
    }
  }, [products]);

  // Function to handle "Load More"
  const handleLoadMore = async () => {
    if (currentPage < pages && !isLoadingMore) {
      setIsLoadingMore(true); // Set loading state
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      try {
        await fetchProducts('', nextPage); // Fetch the new products
      } catch (error) {
        console.error('Error fetching more products', error);
      } finally {
        setIsLoadingMore(false); // Reset loading state
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProduct} style={{ float: 'right' }}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loading || isLoadingMore ? (
        <Loader /> // Show loading indicator when loading
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Link href={`/admin/products/edit/${product._id}`} passHref>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          deleteProduct(product._id);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Paginate pages={pages} page={page} isAdmin={true} />

          {/* Load More Button */}
          {currentPage < pages && (
            <div className="text-center mt-3">
              <Button variant="primary" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductsList;
