import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchItems } from "../store/slices/itemSlice";
import { ItemCard } from "../components/items/ItemCard";
import type { ItemFilters } from "../types/item";

export const Items = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, pagination } = useSelector(
    (state: RootState) => state.items
  );
  const [filters, setFilters] = useState<ItemFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchItems({ page: currentPage, limit: 12, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handleFilterChange = (newFilters: Partial<ItemFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Search items..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={filters.category || ""}
                onChange={(e) =>
                  handleFilterChange({ category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="SHOES">Shoes</option>
                <option value="BAGS">Bags</option>
              </select>
            </div>

            {/* Condition */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={filters.condition || ""}
                onChange={(e) =>
                  handleFilterChange({ condition: e.target.value as any })
                }
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Reset Filters */}
            <button
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => setFilters({})}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`px-4 py-2 border rounded-md ${
                        currentPage === page
                          ? "bg-purple-600 text-white border-purple-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
