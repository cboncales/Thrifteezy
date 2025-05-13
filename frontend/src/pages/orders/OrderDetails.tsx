import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchOrderById, cancelOrder } from "../../store/slices/ordersSlice";

export const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (id && window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder(id)).unwrap();
        navigate("/orders");
      } catch (err) {
        // Error is handled by the orders slice
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || "Order not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        {currentOrder.status === "PENDING" && (
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order #{currentOrder.id}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on{" "}
                {new Date(currentOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                currentOrder.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : currentOrder.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {currentOrder.status.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Total Amount
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${currentOrder.total.toFixed(2)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Items</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {currentOrder.items.length} items
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200">
          <h4 className="px-4 py-5 sm:px-6 text-lg font-medium text-gray-900">
            Order Items
          </h4>
          <ul className="divide-y divide-gray-200">
            {currentOrder.items.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img
                        className="h-16 w-16 rounded-md object-cover"
                        src={item.imageUrl}
                        alt={item.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
