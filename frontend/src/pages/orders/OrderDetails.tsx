import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  cancelOrder,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
} from "../../store/slices/ordersSlice";
import type { AppDispatch } from "../../store";
import { toast } from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCancelOrder = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder(id)).unwrap();
        toast.success("Order cancelled successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to cancel order");
      }
    }
  };

  if (isLoading && !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">
            Order not found or has been deleted.
          </p>
          <Link
            to="/orders"
            className="inline-block bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="text-purple-600 hover:text-purple-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">Order ID: {order.id}</p>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-600">
                    Price: ₱{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₱{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">₱0.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-purple-600">
              ₱{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {order.status === "PENDING" && (
          <div className="p-6 bg-gray-50">
            <button
              onClick={handleCancelOrder}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
