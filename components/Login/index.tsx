import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useTypedSelector, useUserActions } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import {  FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useUserActions();
  const { loading, error } = useTypedSelector(state => state.userLogin);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!error || (email.length > 0 && password.length > 0)) {
      login(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex-col items-center justify-center">
      <div className="primary max-w-xl w-screen mx-auto 
        rounded-xl shadow-2xl 
        backdrop-blur-md bg-white/40 
        border-4 border-opacity-10
        p-6">

        <div className="relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaUserTie size={52} className="text-gray-700" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-8">Sign In</h2>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <form onSubmit={onSubmitHandler} className="space-y-4 p-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
                placeholder="Enter password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            Sign In
          </button>

          <Link href="/resetPwd" className="text-teal-600 hover:underline font-medium">
            Fogot Password ?
          </Link>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6 pb-8">
          New Customer?{" "}
          <Link href="/register" className="text-teal-600 hover:underline font-medium">
            Register
          </Link>
          
        </p>
        
      </div>
    </div>
  );
};

export default Login;