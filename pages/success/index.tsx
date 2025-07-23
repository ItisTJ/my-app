import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SignUpSteps from '../../components/SignUpSteps';
import { FaCheckDouble, FaUserLarge } from 'react-icons/fa6';

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

    <main className="pt-40"
        style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover' }}>
<div className="min-h-screen bg-transparent flex-col items-center justify-center">
      <div className="ternary max-w-xl w-screen mx-auto 
        rounded-xl shadow-2xl 
        backdrop-blur-md bg-white/40 
        border-[1px] border-opacity-10
        p-6">
        <div className="gradient relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaCheckDouble size={52} className="text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        <SignUpSteps step1={true} step2={true} step3={true} />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 mt-8">
          Congratulations!
        </h2>

        <p className="text-center text-gray-600 mb-4 px-8">
          {message ? (
            <span className="text-gray-600 font-medium">{message}</span>
          ) : (
            'Your operation was successful.'
          )}
        </p>

        <div className="flex justify-center pb-8">
          <button
            onClick={() => router.push('/login')}
            className="secondary w-fit p-4 mx-8 bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Proceed to login
          </button>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Success;