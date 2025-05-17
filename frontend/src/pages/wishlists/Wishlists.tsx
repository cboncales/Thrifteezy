import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchWishlists,
  deleteWishlist,
  selectWishlists,
} from "../../store/slices/wishlistsSlice";

export default function Wishlists() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlists = useSelector(selectWishlists);
  const { isLoading, error } = useSelector(
    (state: RootState) => state.wishlists
  );

  useEffect(() => {
    dispatch(fetchWishlists()).then((action) => {
      console.log("Fetched wishlists:", action.payload);
    });
  }, [dispatch]);

  const handleDeleteWishlist = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this wishlist?")) {
      try {
        await dispatch(deleteWishlist(id)).unwrap();
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

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-2 text-gray-600">Items you've saved for later</p>
      </div>

      {Array.isArray(wishlists) && wishlists.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(wishlists) &&
            wishlists.map((wishlist) => (
              <div
                key={wishlist.id}
                className="bg-white shadow rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {wishlist.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {wishlist.items.length}{" "}
                        {wishlist.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    {wishlist.isPublic !== undefined && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          wishlist.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {wishlist.isPublic ? "Public" : "Private"}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/wishlists/${wishlist.id}`}
                      className="text-sm font-medium text-purple-600 hover:text-purple-500"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteWishlist(wishlist.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
