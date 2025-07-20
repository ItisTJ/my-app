import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SignUpSteps from '../../components/SignUpSteps';
import { FaCheckDouble } from 'react-icons/fa6';
import { useTypedSelector } from '../../hooks';
import Link from 'next/link';

const Success = () => {
  const router = useRouter();
  const user = useTypedSelector((state) => state.user.data);
  const { session_id } = router.query;

  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null); // ✅ Track orderId

  useEffect(() => {
    const confirmPayment = async () => {
      if (typeof session_id === 'string' && user?._id) {
        try {
          console.log('Sending sessionId to backend:', session_id);

          const res = await axios.post('http://localhost:4000/api/orders/create-from-stripe', {
            sessionId: session_id,
            userId: user._id,
          });

          console.log('Backend response:', res.data);

          if (res.data.success) {
            setMessage('Your payment was successful, and your order is confirmed!');
            setOrderId(res.data.order._id); // ✅ FIXED: use order._id
          } else {
            setMessage('Payment confirmed, but failed to update the order. Please contact support.');
          }
        } catch (err) {
          console.error(err);
          setMessage('Failed to confirm payment. Please try again.');
        }
      }
    };

    confirmPayment();
  }, [session_id, user?._id]);

  return (
    <div className="min-h-screen bg-gray-50 flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md ml-auto mr-auto">
        <div className="relative h-24 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12">
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg">
            <FaCheckDouble size={52} className="text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        <SignUpSteps step1 step2 step3 />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 mt-8">
          Your Payment was Successful!
        </h2>

        <p className="text-center text-gray-600 mb-4 px-8">
          {message ? (
            <span className="text-gray-600 font-medium">{message}</span>
          ) : (
            'Checking your payment...'
          )}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          {/* Existing Button */}
          <button
            onClick={() => router.push('/')}
            className="w-fit p-4 mx-8 bg-gradient-to-r from-blue-950 to-teal-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Back to Shopping
          </button>

          {/* ✅ New Details Button */}
          {orderId && (
            <Link href={`/orders/${orderId}`} passHref>
              <button
                className="w-fit p-4 mx-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition"
              >
                View Order Details
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
