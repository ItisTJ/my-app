import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useTypedSelector, useUserActions } from '../../hooks';
import { UserCredentials } from '../../interfaces';
import FormContainer from '../FormContainer';
import Loader from '../Loader';
import Message from '../Message';
import SignUpSteps from '../SignUpSteps';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();

  const initialCredentials: UserCredentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { register } = useUserActions();
  const { loading, error } = useTypedSelector(state => state.userRegister);

  const [credentials, setCredentials] = useState(initialCredentials);
  const [message, setMessage] = useState<string | null | string[]>(error);

  useEffect(() => {
    setMessage(error);
  }, [error]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = credentials;

    if (!name || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const success = await register(name, email, password);

    if (success) {
      router.push({
        pathname: '/verifyToken',
        query: { name, email },
      });
    }
  };

  return (
    <FormContainer>
      <SignUpSteps step1 step2={false} step3={false} />
      <h1>Sign Up</h1>

      {message && (
        <Message variant="danger">
          {Array.isArray(message) ? message[0] : message}
        </Message>
      )}
      {loading && <Loader />}

      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={credentials.name}
            onChange={e =>
              setCredentials({ ...credentials, name: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="email" className="py-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={credentials.email}
            onChange={e =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={e =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="py-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={credentials.confirmPassword}
            onChange={e =>
              setCredentials({
                ...credentials,
                confirmPassword: e.target.value,
              })
            }
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="my-1">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an Account? <Link href="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Register;
