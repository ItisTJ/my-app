import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SignUpSteps from '../SignUpSteps';
import { FaUserLarge } from 'react-icons/fa6';

const VerifyToken = () => {
  const router = useRouter();
  const { email: queryEmail, name } = router.query;

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'danger'>('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryEmail) {
      setEmail("Couldn't find an email");
    }

    if (typeof queryEmail === 'string') {
      setEmail(queryEmail);
    }
  }, [queryEmail]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email || !otp) {
      setVariant('danger');
      setMessage('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:4000/api/auth/verify', { email, otp });
      setVariant('success');
      setMessage(data.message);

      setTimeout(() => {
        router.push(`/success?msg=${email} verified successfully`);
      }, 2000);
      //eslint-disable-next-line
    } catch (err: any) {
      setVariant('danger');
      setMessage(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for handleResendOtp - implement this function as needed
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Replace with your API call to resend OTP
      const { data } = await axios.post('http://localhost:4000/api/auth/resend-otp', { email });
      setVariant('success');
      setMessage(data.message || 'OTP resent successfully');
    } catch (err: any) {
      setVariant('danger');
      setMessage(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md ml-auto mr-auto">
        <div className="relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaUserLarge size={32} className="text-gray-700" strokeWidth={1.5} />
          </div>
        </div>

        <SignUpSteps step1={true} step2={true} step3={false} />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 mt-8">
          {name ? `Hello ${name}!` : 'Verify Your Email'}
        </h2>

        <p className="text-center text-gray-600 mb-4">
          We have sent an OTP to <span className="font-medium text-blue-600">{email}</span>.
        </p>

        {message && (
          <div
            className={`text-center px-4 py-2 mx-8 mb-4 rounded-lg text-sm font-medium ${
              variant === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 px-8 pb-8">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              id="otp"
              type="text"
              required
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full text-xs mt-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyToken;