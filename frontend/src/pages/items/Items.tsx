import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../store";
import { fetchItems } from "../../store/slices/itemSlice";

export default function Items() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items = [],
    isLoading,
    error,
  } = useSelector((state: RootState) => state.items);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  // Apply filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    const matchesSize = selectedSize ? item.size === selectedSize : true;

    return matchesSearch && matchesPrice && matchesCategory && matchesSize;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000]);
    setSelectedCategory("");
    setSelectedSize("");
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
          onClick={() => dispatch(fetchItems({}))}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Size
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Range: ₱{priceRange[0]} - ₱{priceRange[1]}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>{filteredItems.length} items found</p>
          <p>Showing all results</p>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
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
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative">
              <Link
                to={`/items/${item.id}`}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-0 right-0 p-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {item.condition}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg font-bold text-purple-600">
                      ₱{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-grow">
                    {item.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.size}</span>
                    <span className="text-sm text-gray-500">
                      {item.category}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                className="absolute top-3 left-3 p-1.5 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-200 text-gray-400 hover:text-pink-500"
                onClick={(e) => {
                  e.preventDefault();
                  // Wishlist functionality would be implemented here
                }}
              >
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
