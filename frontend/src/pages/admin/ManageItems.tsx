import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../store";
import { fetchItems, deleteItem } from "../../store/slices/itemSlice";
import { useAuth } from "../../hooks/useAuth";

export default function ManageItems() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useSelector((state: RootState) => state.items.items || []);
  const isLoading = useSelector((state: RootState) => state.items.isLoading);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsDeleting(id);
      try {
        await dispatch(deleteItem(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete item:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Manage Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, edit, and delete items in your store
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          <button
            onClick={() => navigate("/items/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-4 text-center text-gray-500">
            Loading items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 py-4 text-center text-gray-500">
            {searchTerm
              ? "No items match your search"
              : "No items found. Click 'Add New Item' to create one."}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>${item.price.toFixed(2)}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {item.condition?.toLowerCase() || "Unknown"}
                          </span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/items/${item.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isDeleting === item.id}
                        className="p-2 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50 disabled:opacity-50"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
