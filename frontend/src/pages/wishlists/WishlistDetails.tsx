import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchWishlistById,
  removeFromWishlist,
} from "../../store/slices/wishlistsSlice";

export default function WishlistDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentWishlist, isLoading, error } = useSelector(
    (state: RootState) => state.wishlists
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchWishlistById(id));
    }
  }, [dispatch, id]);

  const handleRemoveItem = async (itemId: string) => {
    if (
      id &&
      window.confirm(
        "Are you sure you want to remove this item from your wishlist?"
      )
    ) {
      try {
        await dispatch(removeFromWishlist({ wishlistId: id, itemId })).unwrap();
      } catch (err) {
        // Error is handled by the wishlists slice
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

  if (error || !currentWishlist) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || "Wishlist not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentWishlist.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on{" "}
            {new Date(currentWishlist.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            currentWishlist.isPublic
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {currentWishlist.isPublic ? "Public" : "Private"}
        </span>
      </div>

      {currentWishlist.items.length === 0 ? (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No items in this wishlist
          </h2>
          <p className="text-gray-600 mb-8">
            Start adding items to your wishlist
          </p>
          <button
            onClick={() => navigate("/items")}
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
          >
            Browse Items
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {currentWishlist.items.map((item) => (
              <li key={item.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20">
                      <img
                        className="h-20 w-20 rounded-md object-cover"
                        src={item.imageUrl}
                        alt={item.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/items/${item.id}`)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-500"
                    >
                      View Item
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
