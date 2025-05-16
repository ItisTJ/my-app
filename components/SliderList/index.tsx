import Link from 'next/link';
import { useEffect } from 'react';
import { Button, Table, Image } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useTypedSelector } from '../../hooks';
import { fetchSliders, deleteSlider } from '../../state/Slider/slider.action-creators';
import Loader from '../Loader';
import Message from '../Message';

const SliderList = () => {
  const dispatch = useAppDispatch();

  const { loading, error, data } = useTypedSelector((state) =>
    state.slider || { loading: false, error: null, data: [] }
  );

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this slider product?')) {
      dispatch(deleteSlider(id));
    }
  };

  return (
    <>
      <h1>Slider Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((slider) => (
                <tr key={slider._id}>
                  <td>{slider._id}</td>
                  <td>
                    <Image
                      src={slider.image}
                      alt={slider.name}
                      width={50}
                      height={50}
                      fluid
                    />
                  </td>
                  <td>{slider.name}</td>
                  <td>{slider.description}</td>
                  <td>
                    <Link href={`SliderEdit/${slider._id}`} passHref>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDelete(slider._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No slider products found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SliderList;
