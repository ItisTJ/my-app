"use client"

import { type FormEvent, useEffect, useState } from "react"
import { Eye, User, Mail, Lock, Calendar, DollarSign, Hash, Package, CheckCircle, AlertCircle } from "lucide-react"
import Loader from "../Loader"
import Message from "../Message"
import { useAuth, useOrderActions, useTypedSelector, useUserActions } from "../../hooks"
import type { UserCredentials } from "../../interfaces"
import Link from "next/link"

const Profile = () => {
  useAuth()

  const initialCredentials = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const userData = useTypedSelector((state) => state.user.data)
  const { error, loading, success } = useTypedSelector((state) => state.userUpdate)
  const userOrders = useTypedSelector((state) => state.userOrders)
  const { updateUser } = useUserActions()
  const { fetchUserOrders } = useOrderActions()

  const [credentials, setCredentials] = useState<UserCredentials>(initialCredentials)
  const [message, setMessage] = useState<string | null | string[]>(error)

  useEffect(() => {
    setMessage(error)
  }, [error])

  useEffect(() => {
    if (userData) {
      fetchUserOrders()
      setCredentials((credentials) => ({
        ...credentials,
        name: userData.name,
        email: userData.email,
      }))
    }
  }, [userData, fetchUserOrders])

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = credentials

    if (name.length < 1 && email.length < 1 && password.length < 1) {
      setMessage("Change at least one property.")
      return null
    }

    if (password.length > 0 && password !== confirmPassword) {
      setMessage("Passwords do not match")
      return null
    }

    setMessage(null)
    updateUser({
      name: name.length > 0 ? name : undefined,
      email: email.length > 0 ? email : undefined,
      password: password.length > 0 ? password : undefined,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
              </div>
            </div>

            <div className="p-6">
              {message && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{Array.isArray(message) ? message[0] : message}</span>
                </div>
              )}

              {success && !error && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Profile Updated</span>
                </div>
              )}

              {loading && (
                <div className="mb-4 flex justify-center">
                  <Loader />
                </div>
              )}

              <form onSubmit={onSubmitHandler} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    value={credentials.name}
                    onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Password</span>
                    </div>
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Confirm Password</span>
                    </div>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    value={credentials.confirmPassword}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Package className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">My Orders ({userOrders.data?.length || 0})</h2>
              </div>
            </div>

            {userOrders.loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : userOrders.error ? (
              <div className="p-6">
                <Message variant="danger">{userOrders.error}</Message>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4" />
                          <span>Order ID</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Total</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userOrders.data?.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                            <span className="text-sm font-mono text-gray-900 truncate max-w-[120px]">{order._id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{order.createdAt?.substring(0, 10)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">${order.totalPrice}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link href={`/orders/${order._id}`} passHref>
                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                              <Eye className="h-4 w-4 mr-1.5" />
                              Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {(!userOrders.data || userOrders.data.length === 0) && (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-sm text-gray-500">
                      Your order history will appear here once you make your first purchase.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
