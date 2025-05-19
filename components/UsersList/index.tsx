import Link from 'next/link';
import { useEffect } from 'react';
import { useAdmin, useTypedSelector, useUserActions } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const UsersList = () => {
  useAdmin();

  const { loading, error, data, success } = useTypedSelector(
    state => state.users
  );
  const user = useTypedSelector(state => state.user);
  const { fetchUsers, deleteUser } = useUserActions();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, user.data, success]);

  return (
    <div className="min-h-screen bg-gray-50 flex-col items-center justify-center p-8">
      <div className=" w-full bg-white rounded-xl shadow-md ml-auto mr-auto">
        <div className="relative h-16 rounded-t-xl bg-gradient-to-r from-blue-200 to-gray-100 mb-12 ">
          <h2 className="font-sans text-4xl font-bold text-left ml-32 text-gray-800 mb-6 ">Users</h2>
          <div className="absolute -bottom-10 left-8 bg-white p-4 rounded-full shadow-lg mb-4">
            <FaUser size={36} className="text-gray-700 " />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="overflow-x-auto px-8 pb-8">
            <table className="min-w-full ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">NAME</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">EMAIL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">ADMIN</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200"></th>
                </tr>
              </thead>
              <tbody>
                {data.map(_user => (
                  <tr key={_user._id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-600">{_user._id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{_user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <a href={`mailto:${_user.email}`} className="text-teal-600 hover:underline">{_user.email}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {_user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 flex space-x-2">
                      <Link href={`/admin/users/edit/${_user._id}`} passHref>
                        <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                          <FaEdit className="text-gray-600" />
                        </button>
                      </Link>
                      <button
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to delete this user?'
                            )
                          ) {
                            deleteUser(_user._id);
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;