import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SignUpSteps from '../SignUpSteps';

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


  const handleResendOtp = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    alert(result.message || 'OTP resent!');
  } catch (error) {
    console.error('Resend error:', error);
  }
};


  return (

    <>
    <SignUpSteps step1={true} step2={true} step3={false} />
    
    <div className='flex justify-center items-center mt-10'>
      
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        {name && (
          <h1 className="fs-1 font-bold text-blue-900 text-center mb-8">
            Hello {name}!
          </h1>
        )}
        <p className="text-center text-gray-600 mb-4">
          We have sent an OTP to <span className="font-medium text-blue-600">{email}</span>. Please enter it below to verify your account.
        </p>

        {message && (
          <div
            className={`text-center px-4 py-2 mb-4 rounded-lg text-sm font-medium ${
              variant === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>


          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-900 to-teal-800 hover:bg-blue-900'
            }`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>


          <button
            onClick={handleResendOtp}
            className={`al w-fit py-2 px-4 rounded-lg font-semibold text-white transition-colors mt-4 text-xs ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:bg-blue-900'
            }`}
            disabled={loading}
          >
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>


        </form>
      </div>
    </div>
    </>
  );
};

export default VerifyToken;
