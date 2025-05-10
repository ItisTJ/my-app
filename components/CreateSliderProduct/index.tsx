import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTypedSelector } from "../../hooks";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const SliderUpload = () => {
  const initialData = {
    name: "Sample Name",
    description: "Sample Description",
    image: "", // Image URL
  };

  const { loading, error, success } = useTypedSelector(
    (state) => state.slider
  );

  const [sliderData, setSliderData] = useState(initialData);
  const [message, setMessage] = useState<string | null | string[]>(error);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setMessage(error);
  }, [error]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { name, description, image } = sliderData;
  
    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }
  
    try {
      const config = {
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
      };
  
      const response = await proshopAPI.post(
        "/slider/upload",
        { name, description, image }, // Send as JSON
        config
      );
  
      console.log("Response:", response.data);
      window.location.reload(); //refreshs the browser


      setSliderData(initialData);
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload slider item.");
    }
  };
  

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await proshopAPI.post("/api/upload", formData, config);

      console.log("Image URL:", data);
      setSliderData({...sliderData,  image: data });

    } catch (error) {
      console.error("Image Upload Error:", error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormContainer>
      <h1>Upload Slider Item</h1>

      {message && <Message variant="danger">{message}</Message>}
      {/*{success && window.alert("Slider item uploaded successfully.")}*/}
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

        <Form.Group controlId="image" className="py-2">
              <Form.Label>Image</Form.Label>
              <Form.Group controlId="formFile" onChange={uploadFileHandler}>
                <Form.Control type="file" />
              </Form.Group>
              {uploading && <Loader />}
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
