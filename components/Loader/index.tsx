import { FaCompactDisc } from 'react-icons/fa6';



const Loader: React.FC<{}> = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50"
    >
      <div className="grid gap-3">
        <h2
          className="text-4xl font-manrope font-extrabold text-transparent bg-gradient-to-tr from-indigo-300 to-pink-300 bg-clip-text flex items-center"
        >
          L
          <div
            className="rounded-full flex items-center justify-center w-7 h-7 bg-gradient-to-tr from-indigo-700 to-pink-700 animate-spin"
          >
            <FaCompactDisc className="text-white text-xl" size={40} />
          </div>
          ading...
        </h2>
      </div>
    </div>
  );
};

export default Loader;
