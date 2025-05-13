import { Fragment } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import type { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { Navigation } from "./Navigation";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                {/* Logo */}
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                      Thrifteezy
                    </Link>
                  </div>
                  {/* Desktop Navigation */}
                  <Navigation />
                </div>

                {/* Desktop User Menu */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {user ? (
                    <UserMenu user={user} onLogout={handleLogout} />
                  ) : (
                    <div className="flex space-x-4">
                      <Link
                        to="/login"
                        className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <MobileMenu user={user} onLogout={handleLogout} />
          </>
        )}
      </Disclosure>

      {/* Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
