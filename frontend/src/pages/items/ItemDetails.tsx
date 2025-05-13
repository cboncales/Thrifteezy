import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchItemById } from "../../store/slices/itemSlice";
import { useAuth } from "../../hooks/useAuth";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const {
    currentItem: item,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading item
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error || "Item not found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Item details */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {item.name}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Item information</h2>
            <p className="text-3xl text-gray-900">${item.price.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{item.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h3 className="text-sm text-gray-600">Condition:</h3>
              <p className="ml-2 text-sm text-gray-900">{item.condition}</p>
            </div>
            <div className="flex items-center mt-2">
              <h3 className="text-sm text-gray-600">Category:</h3>
              <p className="ml-2 text-sm text-gray-900">{item.category}</p>
            </div>
          </div>

          {user?.role === "ADMIN" && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => navigate(`/items/${item.id}/edit`)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
