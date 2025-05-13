import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { useAuth } from "../../hooks/useAuth";
import type { AppDispatch, RootState } from "../../store";
import { fetchAllUsers, updateUserRole } from "../../store/slices/authSlice";
import { fetchItems, deleteItem } from "../../store/slices/itemSlice";
import { ItemCard } from "../../components/items/ItemCard";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useSelector((state: RootState) => state.items.items);
  const users = useSelector((state: RootState) => state.auth.users || []);
  const isLoading = useSelector(
    (state: RootState) => state.items.isLoading || state.auth.isLoading
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
    dispatch(fetchAllUsers());
    dispatch(fetchItems({}));
  }, [dispatch, user, navigate]);

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsDeleting(id);
      try {
        await dispatch(deleteItem(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete item:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdateRole = async (
    userId: string,
    newRole: "USER" | "ADMIN"
  ) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Items
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Users
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group relative">
                  <ItemCard item={item} />
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isDeleting === item.id}
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
                </div>
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {user.name}
                          </p>
                          <p className="ml-2 text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateRole(
                                user.id,
                                e.target.value as "USER" | "ADMIN"
                              )
                            }
                            className="ml-2 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
