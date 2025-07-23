import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useAdmin, useTypedSelector, useUserActions } from '../../hooks';
import { UserEditCredentials } from '../../interfaces';
import Loader from '../Loader';
import Message from '../Message';
import { FaArrowLeft } from 'react-icons/fa';

interface UserEditProps {
  pageId: string | string[] | undefined;
}

const UserEdit: React.FC<UserEditProps> = ({ pageId }) => {
  //useAdmin();

  const initialCredentials = {
    name: '',
    email: '',
    isAdmin: false,
  };

  const { error: errorUser } = useTypedSelector(state => state.user);
  const {
    data,
    error: errorEdit,
    loading,
  } = useTypedSelector(state => state.userEdit);
  const { fetchUser, adminUpdateUser } = useUserActions();

  const [credentials, setCredentials] =
    useState<UserEditCredentials>(initialCredentials);

  useEffect(() => {
    fetchUser(pageId as string);
  }, [fetchUser, pageId]);

  useEffect(() => {
    if (data) {
      setCredentials({
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
    }
  }, [data]);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    adminUpdateUser(pageId as string, credentials);
  };

  return (
<div className="min-h-screen bg-transparent flex-col items-center justify-center">
      <div className="ternary max-w-xl w-screen mx-auto 
        rounded-xl shadow-2xl 
        backdrop-blur-md bg-white/40 
        border-[1px] border-opacity-10
        p-6">
        <div className="px-8 py-6">
          <Link href="/admin/users" passHref>
            <button className="group mb-6 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
              <FaArrowLeft className="mr-2 inline transform transition-transform duration-300 group-hover:-translate-x-1" /> Back
            </button>
          </Link>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit User</h2>

          {loading && <Loader />}
          {errorEdit && !errorUser && (
            <Message variant="danger">{errorEdit}</Message>
          )}

          {errorUser ? (
            <Message variant="danger">{errorUser}</Message>
          ) : (
            <form onSubmit={onSubmitHandler} className="space-y-4 pb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  type="text"
                  value={credentials.name}
                  onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label htmlFor="isadmin" className="flex items-center space-x-2">
                  <input
                    id="isadmin"
                    type="checkbox"
                    checked={credentials.isAdmin}
                    onChange={(e) => setCredentials({ ...credentials, isAdmin: e.target.checked })}
                    className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Is Admin</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="secondary w-full hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
              >
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEdit;