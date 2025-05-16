import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserGroupIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import type { RootState } from "../../store";

const userNavigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Items", href: "/items", icon: ShoppingBagIcon },
  { name: "Orders", href: "/orders", icon: ShoppingCartIcon },
  { name: "Wishlists", href: "/wishlists", icon: HeartIcon },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Manage Items", href: "/admin/items", icon: CubeIcon },
  { name: "Manage Users", href: "/admin/users", icon: UserGroupIcon },
];

export function Navigation() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = user?.role === "ADMIN" ? adminNavigation : userNavigation;

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
