import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useTypedSelector } from '../../../hooks';
import { updateSlider, fetchSliders } from '../../../state/Slider/slider.action-creators';
import { SliderInterface } from '../../../interfaces';
import Loader from '../../../components/Loader';
import Message from '../../../components/Message';

const SliderEdit = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = router.query;

  const { data, loading, error } = useTypedSelector((state) => state.slider);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [productId, setProductId] = useState('');

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchSliders());
    } else {
      const sliderToEdit = data.find((slider: SliderInterface) => slider._id === id);
      if (sliderToEdit) {
        setName(sliderToEdit.name);
        setDescription(sliderToEdit.description);
        setImage(sliderToEdit.image);
        setProductId(sliderToEdit.productId || ''); // Assuming productId is part of the slider
      }
    }
  }, [data, dispatch, id]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id === 'string') {
      dispatch(updateSlider({ _id: id, name, description, image, productId }));
      router.push('/admin/updateSlider'); // or wherever your list page is
    }
  };

  return (
    <div className="container mt-40 mb-20 p-4 bg-white rounded shadow">
      <h1 className="mb-4 text-center text-primary">Edit Slider</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Slider Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter slider name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
  
          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
  
          <Form.Group controlId="image" className="mb-4">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
  
          <Button type="submit" variant="primary" className="w-60 rounded-lg border-lg secondary">
            Update
          </Button>
        </Form>
      )}
    </div>

  );
};

export default SliderEdit;
