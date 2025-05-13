import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Items", href: "/items" },
  { name: "Orders", href: "/orders" },
  { name: "Wishlists", href: "/wishlists" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {navigation.map((item) => {
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
              isActive
                ? "border-blue-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
