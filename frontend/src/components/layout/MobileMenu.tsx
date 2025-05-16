import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserGroupIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import type { User } from "../../types";

interface MobileMenuProps {
  user: User | null;
  onLogout: () => void;
}

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

export function MobileMenu({ user, onLogout }: MobileMenuProps) {
  const location = useLocation();
  const navigation = user?.role === "ADMIN" ? adminNavigation : userNavigation;

  return (
    <Disclosure.Panel className="sm:hidden">
      <div className="space-y-1 pb-3 pt-2">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Disclosure.Button
              key={item.name}
              as={Link}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-base font-medium ${
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Disclosure.Button>
          );
        })}
      </div>

      {user ? (
        <div className="border-t border-gray-200 pb-3 pt-4">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-800">
                {user.name}
              </div>
              <div className="text-xs font-medium text-gray-500">
                {user.email}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Disclosure.Button
              as={Link}
              to="/profile"
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Your Profile
            </Disclosure.Button>
            <Disclosure.Button
              as="button"
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Sign out
            </Disclosure.Button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 pb-3 pt-4">
          <div className="space-y-1">
            <Disclosure.Button
              as={Link}
              to="/login"
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Login
            </Disclosure.Button>
            <Disclosure.Button
              as={Link}
              to="/register"
              className="block px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
            >
              Register
            </Disclosure.Button>
          </div>
        </div>
      )}
    </Disclosure.Panel>
  );
}
