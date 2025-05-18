import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchWishlists,
  fetchDefaultWishlist,
  removeFromWishlist,
  selectWishlists,
  selectCurrentWishlist,
} from "../../store/slices/wishlistsSlice";
import { toast } from "react-hot-toast";

export default function Wishlists() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlists = useSelector(selectWishlists);
  const currentWishlist = useSelector(selectCurrentWishlist);
  const { isLoading, error } = useSelector(
    (state: RootState) => state.wishlists
  );

  useEffect(() => {
    // Fetch default wishlist to ensure we have the current items
    dispatch(fetchDefaultWishlist()).then(() => {
      dispatch(fetchWishlists()).then((action) => {
        console.log("Fetched wishlists:", action.payload);
      });
    });
  }, [dispatch]);

  const handleRemoveItem = async (itemId: string) => {
    if (!currentWishlist) {
      toast.error("No wishlist available");
      return;
    }

    if (window.confirm("Remove this item from your wishlist?")) {
      try {
        await dispatch(
          removeFromWishlist({
            wishlistId: currentWishlist.id,
            itemId,
          })
        ).unwrap();
        toast.success("Item removed from wishlist");
      } catch (err) {
        toast.error("Failed to remove item");
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

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  // Check if there are any wishlist items
  const hasItems =
    currentWishlist &&
    currentWishlist.items &&
    currentWishlist.items.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-2 text-gray-600">Items you've saved for later</p>
      </div>

      {!hasItems ? (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Browse items and add them to your wishlist to keep track of things
            you love.
          </p>
          <Link
            to="/items"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentWishlist?.items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
            >
              <Link to={`/items/${item.id}`}>
                <div className="relative pb-[100%]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 text-purple-600 font-medium">
                    ₱{item.price.toFixed(2)}
                  </p>
                </div>
              </Link>
              <div className="px-4 pb-4 pt-1 flex justify-end">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
