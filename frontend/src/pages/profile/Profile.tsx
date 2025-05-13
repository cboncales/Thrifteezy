import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { fetchWishlists } from "../../store/slices/wishlistsSlice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { orders, isLoading: ordersLoading } = useSelector(
    (state: RootState) => state.orders
  );
  const { wishlists, isLoading: wishlistsLoading } = useSelector(
    (state: RootState) => state.wishlists
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
      dispatch(fetchWishlists());
    }
  }, [dispatch, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* User Info */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and account information.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Member since
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your recent purchase history.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {ordersLoading ? (
              <div className="px-4 py-5 sm:px-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No orders yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Wishlists */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Wishlists
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Collections of items you're interested in.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {wishlistsLoading ? (
              <div className="px-4 py-5 sm:px-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : wishlists.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No wishlists yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {wishlists.map((wishlist) => (
                  <li key={wishlist.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {wishlist.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created on{" "}
                            {new Date(wishlist.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {wishlist.items.length} items
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            wishlist.isPublic
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {wishlist.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
