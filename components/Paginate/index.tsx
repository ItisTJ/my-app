import { Pagination, Button } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter for managing page URLs

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword?: string;
  onLoadMore?: () => void; // Adding onLoadMore here
}

const Paginate: React.FC<PaginateProps> = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  onLoadMore, // Destructuring onLoadMore here
}) => {
  const router = useRouter(); // Use Next.js router to control page navigation

  const handlePageClick = (newPage: number) => {
    // Update the page in the URL using the router
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, pageId: newPage }, // Add or update the pageId query param
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <Pagination.Item
              key={x}
              active={x + 1 === page}
              onClick={() => handlePageClick(x + 1)} // Update URL and fetch new data on page click
            >
              {x + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Check if the onLoadMore function is passed */}
      {onLoadMore && (
        <Button variant="primary" onClick={onLoadMore}>
          Load More
        </Button>
      )}
    </>
  );
};

export default Paginate;
