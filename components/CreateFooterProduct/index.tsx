import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Button, Col, Form, Row, Table, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const FooterManager = () => {
  const dispatch = useDispatch();

  // Redux state for footer data
  const { loading, error, data } = useTypedSelector((state) => state.footer || { loading: false, error: null, data: [] });

  // Assume there's only one data entry
  const footer = Array.isArray(data) && data.length > 0 ? data[0] : null;

  // Form state
  const [footerData, setFooterData] = useState({
    name: footer?.name || "",
    description: footer?.description || "",
    image: footer?.image || "",
  });

  const [message, setMessage] = useState<string | null | string[]>(error);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchFooter());
  }, [dispatch]);

  // Update form state when Redux data is loaded
  useEffect(() => {
    if (footer) {
      setFooterData({
        name: footer.name,
        description: footer.description,
        image: footer.image,
      });
    }
  }, [footer]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, description, image } = footerData;

    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      await proshopAPI.post("/footer/upload", { name, description, image }, config);
      window.location.reload(); // Refresh browser

      setFooterData({
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
      setFooterData({ ...footerData, image: data });
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
            <h2>Update Footer</h2>

            {message && <Message variant="danger">{message}</Message>}
            {loading && <Loader />}

            <Form onSubmit={onSubmitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Footer Name</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={footerData.name}
                      onChange={(e) => setFooterData({ ...footerData, name: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Text className="text-muted">{footer?.name || "No data"}</Form.Text>
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
                      value={footerData.description}
                      onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Text className="text-muted">{footer?.description || "No data"}</Form.Text>
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
                    {footer?.image && (
                      <Image src={footer.image} alt="Current" width={50} height={50} fluid />
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

export default FooterManager;
