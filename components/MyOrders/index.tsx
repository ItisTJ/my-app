"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Eye, Calendar, DollarSign, Hash, CheckCircle, XCircle, Package, CreditCard } from "lucide-react"
import { useOrderActions, useTypedSelector } from "../../hooks"
import Loader from "../Loader"
import Message from "../Message"

const MyOrders = () => {
  const { fetchUserOrders } = useOrderActions()
  // ✅ Fixed: Pull from `userOrders`
  const { data: orders, loading, error } = useTypedSelector((state) => state.userOrders)
  const user = useTypedSelector((state) => state.user)

  useEffect(() => {
    if (user) {
      fetchUserOrders()
    }
  }, [user])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center">
                <Package className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Your Order History ({orders?.length || 0})</h2>
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
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Delivery</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders?.map((order : any) => (
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
                      {order.isPaid ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-700">Paid</span>
                            <span className="text-xs text-gray-500">{order.paidAt?.substring(0, 10)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">Unpaid</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isDelivered ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-700">Delivered</span>
                            <span className="text-xs text-gray-500">{order.deliveredAt?.substring(0, 10)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link href={`/orders?orderId=${order._id}`} passHref>
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
          </div>

          {(!orders || orders.length === 0) && !loading && (
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
  )
}

export default MyOrders
