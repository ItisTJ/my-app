import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SignUpSteps from '../../components/SignUpSteps';
import { FaUserGraduate } from 'react-icons/fa';

const Success = () => {
  const router = useRouter();
  const { msg } = router.query;

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof msg === 'string') {
      setMessage(msg);
    }
  }, [msg]);

  return (
    <div className="min-h-screen bg-gray-50 flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md ml-auto mr-auto">
        {/* Gradient header and icon */}
        <div className="relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaUserGraduate size={60} className="text-green-800" strokeWidth={1.5} />
          </div>
        </div>

        {/* Steps */}
        <SignUpSteps step1={true} step2={true} step3={true} />

        {/* Message Section */}
        <h1 className="text-2xl font-bold text-center text-blue-900 mt-10 mb-4">
          Congratulations!
        </h1>

        <p className="text-center text-gray-600 mb-6 px-6">
          {message ? (
            <span className="text-gray-600 font-medium">{message}</span>
          ) : (
            'Your operation was successful.'
          )}
        </p>

        {/* Proceed Button */}
        <div className="flex justify-center px-8 pb-8">
          <button
            onClick={() => router.push('/login')}
            className="w-fit p-4 bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Proceed to Login
            
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Success;
