import { FormEvent, useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTypedSelector, useSliderActions } from "../../hooks";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const SliderUpload = () => {
  const initialData = {
    name: "",
    description: "",
    image: null as File | null,
  };

  const { uploadSliderItem } = useSliderActions(); // Replace with your actual upload function
  const { loading, error, success } = useTypedSelector(
    (state) => state.slider
  );

  const [sliderData, setSliderData] = useState(initialData);
  const [message, setMessage] = useState<string | null | string[]>(error);

  useEffect(() => {
    setMessage(error);
  }, [error]);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, description, image } = sliderData;

    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }

    // FormData for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    uploadSliderItem(formData);
  };

  return (
    <FormContainer>
      <h1>Upload Slider Item</h1>

      {message && <Message variant="danger">{message}</Message>}
      {success && <Message variant="success">Upload successful!</Message>}
      {loading && <Loader />}

      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Slider Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={sliderData.name}
            onChange={(e) =>
              setSliderData({ ...sliderData, name: e.target.value })
            }
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="description" className="py-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter description"
            value={sliderData.description}
            onChange={(e) =>
              setSliderData({ ...sliderData, description: e.target.value })
            }
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSliderData({
                ...sliderData,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-1">
          Upload
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          View Slider Items? <a href="/admin/slider">Go to Slider</a>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default SliderUpload;
