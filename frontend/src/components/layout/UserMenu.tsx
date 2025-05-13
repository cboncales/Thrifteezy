import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import type { User } from "../../types";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-sm font-medium text-purple-700">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500 truncate text-xs">{user.email}</p>
          </div>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={classNames(
                  active ? "bg-purple-50" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Your Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogout}
                className={classNames(
                  active ? "bg-purple-50" : "",
                  "block w-full text-left px-4 py-2 text-sm text-gray-700"
                )}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
