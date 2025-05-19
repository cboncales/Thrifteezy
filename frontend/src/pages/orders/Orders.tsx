import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchOrders,
  selectOrders,
  cancelOrder,
} from "../../store/slices/ordersSlice";
import { toast } from "react-hot-toast";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders);
  const { isLoading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success("Order cancelled successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to cancel order");
      }
    }
  };

  if (isLoading && (!Array.isArray(orders) || orders.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  // Check if there are any orders
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Your purchase history</p>
      </div>

      {!hasOrders ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mb-4 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            You haven't placed any orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our items and make your first purchase!
          </p>
          <Link
            to="/items"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{order.id.substring(0, 8)}...
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {Array.isArray(order.items) &&
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6"
                      >
                        <dt className="text-sm font-medium text-gray-500 sm:col-span-1">
                          <div className="w-20 h-20">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </div>
                        </dd>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 text-right">
                          ₱{item.price.toFixed(2)}
                        </dd>
                      </div>
                    ))}

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right font-bold">
                      ₱{order.total.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                >
                  View Details
                </Link>

                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
