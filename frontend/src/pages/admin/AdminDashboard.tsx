import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { user } = useAuth();
  const items = useSelector((state: RootState) => state.items.items || []);
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

  // Determine which tab to show based on the current route
  const currentTab = location.pathname.includes("/admin/users") ? 1 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's items and users
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => navigate("/items/create")}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add New Item
          </button>
        </div>
      </div>

      <Tab.Group
        selectedIndex={currentTab}
        onChange={(index) => {
          navigate(index === 0 ? "/admin/items" : "/admin/users");
        }}
      >
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
            Manage Items
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
            Manage Users
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="px-4 py-4 text-center text-gray-500">
                  Loading items...
                </div>
              ) : items.length === 0 ? (
                <div className="px-4 py-4 text-center text-gray-500">
                  No items found. Click "Add New Item" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onDelete={() => handleDeleteItem(item.id)}
                      isDeleting={isDeleting === item.id}
                      showAdminControls
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="px-4 py-4 text-center text-gray-500">
                  Loading users...
                </div>
              ) : (
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
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
