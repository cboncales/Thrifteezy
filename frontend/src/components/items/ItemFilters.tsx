import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../store";
import {
  setFilters,
  clearFilters,
  fetchCategories,
} from "../../store/slices/itemSlice";

export const ItemFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, categories, isLoading } = useSelector(
    (state: RootState) => ({
      filters: state.items.filters,
      categories: state.items.categories,
      isLoading: state.items.isLoading,
    })
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ category: e.target.value || undefined }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ condition: e.target.value || undefined }));
  };

  const handlePriceChange =
    (type: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      dispatch(
        setFilters({ [type === "min" ? "minPrice" : "maxPrice"]: value })
      );
    };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: (e.target.value as any) || undefined }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <XMarkIcon className="h-4 w-4 mr-1" />
          Clear all
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.search || ""}
          onChange={handleSearchChange}
          placeholder="Search items..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={filters.category || ""}
          onChange={handleCategoryChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condition
        </label>
        <select
          id="condition"
          value={filters.condition || ""}
          onChange={handleConditionChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Conditions</option>
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Min Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="minPrice"
              value={filters.minPrice || ""}
              onChange={handlePriceChange("min")}
              className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0"
              min="0"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Max Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="maxPrice"
              value={filters.maxPrice || ""}
              onChange={handlePriceChange("max")}
              className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="1000"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700"
        >
          Sort By
        </label>
        <select
          id="sort"
          value={filters.sortBy || ""}
          onChange={handleSortChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};
