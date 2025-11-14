import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { useTypedSelector, useUserActions } from '../../hooks';
import { UserCredentials } from '../../interfaces';
import FormContainer from '../FormContainer';
import Loader from '../Loader';
import Message from '../Message';
import SignUpSteps from '../SignUpSteps';
import { useRouter } from 'next/router';
import { FaUserLarge, FaEye, FaEyeSlash } from 'react-icons/fa6';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  try {
    await register(name, email, password);
    
    // After successful registration, navigate
    router.push({
      pathname: '/verifyToken',
      query: { name, email },
    });
  } catch (error) {
    // Error will be caught and set in Redux state
    console.error('Registration failed:', error);
  }
};

  return (
    <div className="min-h-screen bg-transparent flex-col items-center justify-center">
      <div className="ternary max-w-xl w-screen mx-auto 
        rounded-xl shadow-2xl 
        backdrop-blur-md bg-white/40 
        border-[1px] border-opacity-10
        p-6">
        <div className="gradient relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className=" absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaUserLarge size={32} className="text-gray-700" strokeWidth={1.5} />
          </div>
        </div>

        <SignUpSteps step1 step2={false} step3={false} />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-8">Create Your Account</h2>

        {message && <Message variant="danger">{Array.isArray(message) ? message[0] : message}</Message>}
        {loading && <Loader />}

        <form onSubmit={onSubmitHandler} className="space-y-4 p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={credentials.name}
              onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="secondary w-full bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;