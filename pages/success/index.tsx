import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SignUpSteps from '../../components/SignUpSteps';

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
    <>

    <div className="flex-col justify-center items-center mt-20 mb-24 h-[430px]">
        <SignUpSteps step1={true} step2={true} step3={true} />
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md ml-auto mr-auto mt-16">
          <h1 className="fs-1 font-bold text-blue-900 text-center mb-8">congratulations </h1>

          <p className="text-center text-gray-600 mb-4">
            {message ? (
              <span className="text-gray-600 font-medium">{message}</span>
            ) : (
              'Your operation was successful.'
            )}
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => router.push('/login')}
              className="mt-4 bg-gradient-to-r from-blue-900 to-teal-800 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Proceed to login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
