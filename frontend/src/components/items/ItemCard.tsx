import { Link } from "react-router-dom";
import type { Item } from "../../store/slices/itemSlice";

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
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative">
      <Link to={`/items/${item.id}`}>
        <div className="relative pb-[100%]">
          <img
            src={item.photoUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-purple-600 font-bold">
              ${item.price.toFixed(2)}
            </p>
            <span className="text-sm text-gray-500">
              {item.condition.toLowerCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>
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
