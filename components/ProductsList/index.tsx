import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import { useRouter } from 'next/router';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
}

interface ProductListProps {
  pageId?: string;
}

const ProductsList: React.FC<ProductListProps> = ({ pageId }) => {
  useAdmin();

  const { fetchProducts, deleteProduct, createProduct } = useProductsActions();

  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector((state) => state.products);

  const { success: successDelete } = useTypedSelector((state) => state.productDelete);

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageId || '1'));
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch products for all pages from 1 to the current pageId
  useEffect(() => {
    const queryPage = router.query.pageId ? parseInt(router.query.pageId as string) : 1;
    setCurrentPage(queryPage);

    const fetchAllPages = async () => {
      let accumulatedProducts: Product[] = [];
      for (let i = 1; i <= queryPage; i++) {
        await fetchProducts('', i);
      }
    };

    fetchAllPages();
  }, [fetchProducts, router.query.pageId]);

  // Accumulate products and filter duplicates
  useEffect(() => {
    if (products.length > 0) {
      const newProducts = products.filter((product) => !allProducts.some((p) => p._id === product._id));
      setAllProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }
    // Reset allProducts if pageId is 1
    if (currentPage === 1) {
      setAllProducts(products);
    }
  }, [products, currentPage]);

  // Refresh products after a successful deletion
  useEffect(() => {
    if (successDelete) {
      setAllProducts([]); // Clear current products
      const fetchAllPages = async () => {
        for (let i = 1; i <= currentPage; i++) {
          await fetchProducts('', i);
        }
      };
      fetchAllPages();
    }
  }, [successDelete, fetchProducts, currentPage]);

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

      {loading ? (
        <Loader />
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

          <div className="d-flex justify-content-between mt-3">
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

export default ProductsList;