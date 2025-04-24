import { Pagination } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword?: string;
}

const Paginate: React.FC<PaginateProps> = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const router = useRouter();

  const handlePageClick = (newPage: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, pageId: newPage },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {pages > 1 && (
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageClick(page - 1)}
            disabled={page === 1}
          />
          
          {[...Array(pages).keys()].map((x) => (
            <Pagination.Item
              key={x}
              active={x + 1 === page}
              onClick={() => handlePageClick(x + 1)}
            >
              {x + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handlePageClick(page + 1)}
            disabled={page === pages}
          />
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
