import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import type { User } from "../../types";

interface MobileMenuProps {
  user: User | null;
  onLogout: () => void;
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Items", href: "/items" },
  { name: "Orders", href: "/orders" },
  { name: "Wishlists", href: "/wishlists" },
];

export function MobileMenu({ user, onLogout }: MobileMenuProps) {
  const location = useLocation();

  return (
    <Disclosure.Panel className="sm:hidden">
      <div className="space-y-1 pb-3 pt-2">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));

          return (
            <Disclosure.Button
              key={item.name}
              as={Link}
              to={item.href}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {item.name}
            </Disclosure.Button>
          );
        })}
      </div>

      {user ? (
        <div className="border-t border-gray-200 pb-3 pt-4">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                {user.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user.email}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Disclosure.Button
              as={Link}
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Your Profile
            </Disclosure.Button>
            <Disclosure.Button
              as="button"
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
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
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Login
            </Disclosure.Button>
            <Disclosure.Button
              as={Link}
              to="/register"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Register
            </Disclosure.Button>
          </div>
        </div>
      )}
    </Disclosure.Panel>
  );
}
