import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { fetchItems } from "../../store/slices/itemSlice";

export default function Items() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items = [],
    isLoading,
    error,
  } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
              <p className="mt-2 text-lg font-medium text-gray-900">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
