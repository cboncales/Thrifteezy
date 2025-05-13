import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Items", href: "/items", icon: ShoppingBagIcon },
  { name: "Orders", href: "/orders", icon: ShoppingCartIcon },
  { name: "Wishlists", href: "/wishlists", icon: HeartIcon },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
      {navigation.map((item) => {
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-purple-50 text-purple-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
