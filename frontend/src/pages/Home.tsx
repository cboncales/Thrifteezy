import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchItems } from "../store/slices/itemSlice";
import { ItemCard } from "../components/items/ItemCard";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-24">
        <div className="w-full max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-xl">
              Welcome to <span className="text-yellow-300">Thrifteezy</span>
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Your one-stop shop for sustainable and affordable fashion
            </p>
            <Link
              to="/items"
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-all shadow-md"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="w-full py-20 bg-gray-50">
        <div className="w-full max-w-[1400px] mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Items
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : !Array.isArray(items) ? (
            <div className="text-center text-red-600">
              Error: Items data is invalid
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-600">No items found</div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <Link
              to="/items"
              className="inline-block bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition-all shadow"
            >
              View All Items
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full py-20 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-3 gap-12">
            {[
              {
                title: "Fast Delivery",
                desc: "Get your items delivered quickly and securely",
                iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Secure Shopping",
                desc: "Shop with confidence with our secure payment system",
                iconPath:
                  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
              {
                title: "Easy Returns",
                desc: "Hassle-free returns within 30 days",
                iconPath:
                  "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg
                    className="w-8 h-8 text-purple-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
