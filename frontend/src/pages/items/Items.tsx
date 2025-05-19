import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../store";
import { fetchItems, setFilters, selectFilters } from "../../store/slices/itemSlice";
import { fetchDefaultWishlist } from "../../store/slices/wishlistsSlice";
import { ItemCard } from "../../components/items/ItemCard";
import { useDebounce } from "../../hooks/useDebounce";

export default function Items() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items = [],
    isLoading,
    error,
  } = useSelector((state: RootState) => state.items);
  const filters = useSelector(selectFilters);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Categories and sizes for filtering
  const categories = [
    "T-Shirt",
    "Polo",
    "Jacket",
    "Pants",
    "Shorts",
    "Trouser",
    "Shoes",
    "Bags",
    "Cap/Hat",
    "Other",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

  // Fetch items when filters change
  useEffect(() => {
    dispatch(fetchItems({ ...filters, search: debouncedSearchTerm }));
  }, [dispatch, debouncedSearchTerm, filters.category, filters.condition, filters.minPrice, filters.maxPrice, filters.sortBy]);

  // Fetch default wishlist on mount
  useEffect(() => {
    dispatch(fetchDefaultWishlist());
  }, [dispatch]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    dispatch(setFilters({ search: e.target.value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg max-w-2xl mx-auto my-8 p-6">
        <h2 className="text-xl font-semibold mb-2">Error Loading Items</h2>
        <p>{error}</p>
        <button
          onClick={() => dispatch(fetchItems(filters))}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop Items</h1>
            <p className="text-gray-600 mt-1">
              Browse our curated collection of thrift finds
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative rounded-md shadow-sm flex-grow w-full md:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600"
                placeholder="Search items..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            {/* Filter content */}
          </div>
        )}
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
