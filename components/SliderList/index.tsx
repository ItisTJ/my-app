import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useTypedSelector } from "../../hooks";
import { fetchSliders, deleteSlider } from "../../state/Slider/slider.action-creators";
import Loader from "../Loader";
import Message from "../Message";

const SliderList = () => {
  const dispatch = useAppDispatch();

  const { loading, error, data } = useTypedSelector((state) =>
    state.slider || { loading: false, error: null, data: [] }
  );

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this slider product?")) {
      dispatch(deleteSlider(id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Slider Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">IMAGE</th>
                <th className="px-4 py-2 border-b">NAME</th>
                <th className="px-4 py-2 border-b">DESCRIPTION</th>
                <th className="px-4 py-2 border-b">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((slider) => (
                  <tr key={slider._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{slider._id}</td>
                    <td className="px-4 py-2">
                      <img
                        src={slider.image}
                        alt={slider.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{slider.name}</td>
                    <td className="px-4 py-2">{slider.description}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`SliderEdit/${slider._id}`}>
                        <button className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300">
                          <i className="fas fa-edit" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(slider._id)}
                        className="bg-gray-700 text-white p-2 rounded hover:bg-red-600"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No slider products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SliderList;
