import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Button, Col, Form, Row, Table, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchHeader } from "../../state/Header/header.action-creators";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const HeaderManager = () => {
  const dispatch = useDispatch();

  // Redux state for footer data
  const { loading, error, data } = useTypedSelector((state) => state.header || { loading: false, error: null, data: [] });
  

  // Assume there's only one data entry
  const header = Array.isArray(data) && data.length > 0 ? data[0] : null;
  console.log("Header Data(client):", data);

  // Form state
  const [headerData, setHeaderData] = useState({
    name: header?.name || "Sample name",
    description: header?.description || "Sample Description",
    image: header?.image || "",
  });

  const [message, setMessage] = useState<string | null | string[]>(error);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchHeader());
  }, [dispatch]);

  // Update form state when Redux data is loaded
  useEffect(() => {
    if (header) {
      setHeaderData({
        name: header.name,
        description: header.description,
        image: header.image,
      });
    }
  }, [header]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, description, image } = headerData;

    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      await proshopAPI.post("/header/upload", { name, description, image }, config);
      window.location.reload(); // Refresh browser

      setHeaderData({
        name: "",
        description: "",
        image: "",
      });
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload footer item.");
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

      const { data } = await proshopAPI.post("/upload", formData, config);
      setHeaderData({ ...headerData, image: data });
    } catch (error) {
      console.error("Image Upload Error:", error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>

          {/* Update Form */}
          <FormContainer>
            <h2>Update Header</h2>

            {message && <Message variant="danger">{message}</Message>}
            {loading && <Loader />}

            <Form onSubmit={onSubmitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Header Name</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={headerData.name}
                      onChange={(e) => setHeaderData({ ...headerData, name: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Text className="text-muted">{header?.name || "No data"}</Form.Text>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="description" className="py-3">
                <Form.Label>Description</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter description"
                      value={headerData.description}
                      onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Text className="text-muted">{header?.description || "No data"}</Form.Text>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="image" className="py-2">
                <Form.Label>Image</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control type="file" onChange={uploadFileHandler} />
                    {uploading && <Loader />}
                  </Col>
                  <Col md={6}>
                    {header?.image && (
                      <Image src={header.image} alt="Current" width={50} height={50} fluid />
                    )}
                  </Col>
                </Row>
              </Form.Group>

              <Button type="submit" variant="primary" className="my-1">
                Upload
              </Button>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default HeaderManager;
