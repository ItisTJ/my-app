import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Button, Col, Form, Row } from "react-bootstrap";
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
  const footer = Array.isArray(data) && data.length > 0 ? data[0] : null;

  const [footerData, setFooterData] = useState({
    contactNumber: footer?.contactNumber || "",
    email: footer?.email || "",
    aboutUs: footer?.aboutUs || "",
    fbLink: footer?.fbLink || "",
    whatsappLink: footer?.whatsappLink || "",
    instaLink: footer?.instaLink || "",
    ytLink: footer?.ytLink || "",
    ttLink: footer?.ttLink || "",
  });

  const [message, setMessage] = useState<string | null | string[]>(error);

  useEffect(() => {
    dispatch(fetchFooter());
  }, [dispatch]);

  useEffect(() => {
    if (footer) {
      setFooterData({
        contactNumber: footer.contactNumber,
        email: footer.email,
        aboutUs: footer.aboutUs,
        fbLink: footer.fbLink,
        whatsappLink: footer.whatsappLink,
        instaLink: footer.instaLink,
        ytLink: footer.ytLink,
        ttLink: footer.ttLink,
      });
    }
  }, [footer]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      await proshopAPI.post("/footer/upload", footerData, config);
      window.location.reload();
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload footer item.");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <FormContainer>
          <h1 style={{ textAlign: "center" ,fontSize:"30px"}}>Update Footer</h1>
          {message && <Message variant="danger">{message}</Message>}
          <Form onSubmit={onSubmitHandler}>
            <Form.Group controlId="contactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={footerData.contactNumber}
                onChange={(e) => setFooterData({ ...footerData, contactNumber: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="aboutUs">
              <Form.Label>About Us</Form.Label>
              <Form.Control
                type="textarea"
                as="textarea"
                rows={10}
                value={footerData.aboutUs}
                onChange={(e) => setFooterData({ ...footerData, aboutUs: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="fbLink">
              <Form.Label>Facebook Link</Form.Label>
              <Form.Control
                type="text"
                value={footerData.fbLink}
                onChange={(e) => setFooterData({ ...footerData, fbLink: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="whatsappLink">
              <Form.Label>WhatsApp Link</Form.Label>
              <Form.Control
                type="text"
                value={footerData.whatsappLink}
                onChange={(e) => setFooterData({ ...footerData, whatsappLink: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="instaLink">
              <Form.Label>Instagram Link</Form.Label>
              <Form.Control
                type="text"
                value={footerData.instaLink}
                onChange={(e) => setFooterData({ ...footerData, instaLink: e.target.value })}
              />

            </Form.Group>

            <Form.Group controlId="ytLink">
              <Form.Label>YouTube Link</Form.Label>
              <Form.Control
                type="text"
                value={footerData.ytLink}
                onChange={(e) => setFooterData({ ...footerData, ytLink: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="tiktokLink">
              <Form.Label>TikTok Link</Form.Label>
              <Form.Control
                type="text"
                value={footerData.ttLink}
                onChange={(e) => setFooterData({ ...footerData, ttLink: e.target.value })}
              />
            </Form.Group>

            <br></br>

            <Button type="submit" variant="primary">Update Footer</Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default FooterManager;
