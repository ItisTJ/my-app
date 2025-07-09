"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Eye, Calendar, DollarSign, User, Hash } from "lucide-react"
import { useAdmin, useOrderActions, useTypedSelector } from "../../hooks"
import Loader from "../Loader"
import Message from "../Message"
import { fetchUser } from "@/state/User/user.action-creators"

const OrdersList = () => {
  useAdmin()
  const { data, loading, error } = useTypedSelector((state) => state.orders)
  const { fetchOrders } = useOrderActions()
  const user = useTypedSelector((state) => state.user)

  useEffect(() => {
    fetchOrders()
  }, []) // Only on mount

  console.log("Orders:", data)

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders Management</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Hash className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">All Orders ({data?.length || 0})</h2>
            </div>
          </div>

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
                      <User className="h-4 w-4" />
                      <span>Customer</span>
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
                {data?.map((_order) => (
                  <tr key={_order._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-mono text-gray-900 truncate max-w-[120px]">{_order._id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-950 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {/* Replace with actual user name or email from _order or user state */}
                          {_order.user?.name || _order.user?.email || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{_order.createdAt?.substring(0, 10)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">${_order.totalPrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(_order.status)}`}
                      >
                        {_order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link href={`/orders/${_order._id}`} passHref>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-950 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                          <Eye className="h-4 w-4 mr-1.5" />
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!data || data.length === 0) && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Hash className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm text-gray-500">Orders will appear here once customers start placing them.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrdersList
