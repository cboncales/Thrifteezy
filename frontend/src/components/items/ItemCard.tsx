import { Link } from 'react-router-dom';
import type { Item } from '../../types/item';

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/items/${item.id}`}>
        <div className="relative pb-[100%]">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {item.name}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-purple-600 font-bold">${item.price.toFixed(2)}</p>
            <span className="text-sm text-gray-500">
              {item.condition.toLowerCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>
    </div>
  );
}; 