import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import type { Item } from "../../store/slices/itemSlice";
import type { AppDispatch, RootState } from "../../store";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItemIds,
  fetchDefaultWishlist,
  selectCurrentWishlist,
  selectWishlists,
  createWishlist,
} from "../../store/slices/wishlistsSlice";

interface ItemCardProps {
  item: Item;
  onDelete?: () => void;
  isDeleting?: boolean;
  showAdminControls?: boolean;
}

export const ItemCard = ({
  item,
  onDelete,
  isDeleting,
  showAdminControls,
}: ItemCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [processingWishlist, setProcessingWishlist] = useState(false);

  // Get authentication state
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user && !!token;

  // Get wishlist items and current wishlist from Redux store
  const wishlistItemIds = useSelector(selectWishlistItemIds);
  const currentWishlist = useSelector(selectCurrentWishlist);
  const wishlists = useSelector(selectWishlists);
  const isInWishlist = wishlistItemIds.includes(item.id);

  // Ensure we have a default wishlist only if user is authenticated
  useEffect(() => {
    if (isAuthenticated && !currentWishlist && !processingWishlist) {
      dispatch(fetchDefaultWishlist());
    }
  }, [dispatch, currentWishlist, isAuthenticated, processingWishlist]);

  // Handle wishlist toggle
  const handleToggleWishlist = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error("Please log in to use the wishlist feature", {
          id: "login-required",
        });

        // Ask if they want to navigate to login
        if (
          window.confirm(
            "You need to be logged in to use the wishlist feature. Go to login page?"
          )
        ) {
          navigate("/login");
        }
        return;
      }

      if (processingWishlist) return;

      setProcessingWishlist(true);
      try {
        let wishlistId = currentWishlist?.id;

        // If no current wishlist, check if user has any wishlists
        if (!wishlistId && Array.isArray(wishlists) && wishlists.length > 0) {
          wishlistId = wishlists[0].id;
        }

        // If user has no wishlists, create a single default one
        if (!wishlistId) {
          console.log("Creating default wishlist for user", user?.id);
          const newWishlist = await dispatch(
            createWishlist({ name: "My Wishlist", isPublic: false })
          ).unwrap();
          wishlistId = newWishlist.id;
        }

        if (!wishlistId) {
          toast.error("Unable to access wishlist. Please try again.");
          return;
        }

        // Add or remove item from the single wishlist
        if (isInWishlist) {
          await dispatch(
            removeFromWishlist({ wishlistId, itemId: item.id })
          ).unwrap();
          toast.success("Removed from wishlist");
        } else {
          await dispatch(
            addToWishlist({ wishlistId, itemId: item.id })
          ).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (error: any) {
        console.error("Wishlist error:", error);

        if (
          error?.message?.includes("401") ||
          error?.message?.includes("403")
        ) {
          toast.error("Authentication error. Please log in again.");

          if (
            window.confirm("Your session may have expired. Go to login page?")
          ) {
            navigate("/login");
          }
        } else {
          toast.error(error?.message || "Error updating wishlist");
        }
      } finally {
        setProcessingWishlist(false);
      }
    },
    [
      currentWishlist,
      dispatch,
      isInWishlist,
      item.id,
      processingWishlist,
      isAuthenticated,
      navigate,
      user,
      wishlists,
    ]
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative">
      <Link to={`/items/${item.id}`}>
        <div className="relative pb-[100%]">
          <img
            src={item.photoUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {item.condition}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-purple-600 font-bold">
              ₱{item.price.toFixed(2)}
            </p>
            <div className="flex space-x-2 text-sm text-gray-500">
              <span>{item.size}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>

      {/* Wishlist Heart Button */}
      <button
        className="absolute top-3 left-3 p-1.5 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-200"
        onClick={handleToggleWishlist}
        disabled={processingWishlist}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <HeartSolid className="h-5 w-5 text-pink-500" />
        ) : (
          <HeartOutline className="h-5 w-5 text-gray-400 hover:text-pink-500" />
        )}
      </button>

      {/* Admin controls if needed */}
      {showAdminControls && onDelete && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={isDeleting}
            className="p-1 bg-white rounded-full shadow hover:bg-gray-50 disabled:opacity-50"
          >
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
