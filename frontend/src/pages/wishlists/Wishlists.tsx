import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchWishlists,
  createWishlist,
  deleteWishlist,
} from "../../store/slices/wishlistsSlice";

export default function Wishlists() {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlists, isLoading, error } = useSelector(
    (state: RootState) => state.wishlists
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlists());
  }, [dispatch]);

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    try {
      await dispatch(
        createWishlist({ name: newWishlistName, isPublic })
      ).unwrap();
      setNewWishlistName("");
      setIsPublic(false);
      setIsCreating(false);
    } catch (err) {
      // Error is handled by the wishlists slice
    }
  };

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlists</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Create Wishlist
        </button>
      </div>

      {isCreating && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <form onSubmit={handleCreateWishlist} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Wishlist Name
              </label>
              <input
                type="text"
                id="name"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter wishlist name"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700"
              >
                Make this wishlist public
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {wishlists.length === 0 ? (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No wishlists yet
          </h2>
          <p className="text-gray-600 mb-8">
            Create a wishlist to start saving items you love
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Wishlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((wishlist) => (
            <div
              key={wishlist.id}
              className="bg-white shadow sm:rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {wishlist.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {wishlist.items.length} items
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      wishlist.isPublic
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {wishlist.isPublic ? "Public" : "Private"}
                  </span>
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
