import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Suspense, lazy } from "react";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Orders } from "./pages/orders/Orders";
import { OrderDetails } from "./pages/orders/OrderDetails";
import { AdminRegister } from "./pages/auth/AdminRegister";
import CreateItem from "./pages/items/CreateItem";
import EditItem from "./pages/items/EditItem";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageItems from "./pages/admin/ManageItems";

// Lazy-loaded components
const Layout = lazy(() => import("./components/layout/Layout"));
const HomePage = lazy(() => import("./pages/Home"));
const ItemsPage = lazy(() => import("./pages/items/Items"));
const ItemDetails = lazy(() => import("./pages/items/ItemDetails"));
const WishlistsPage = lazy(() => import("./pages/wishlists/Wishlists"));
const WishlistDetails = lazy(() => import("./pages/wishlists/WishlistDetails"));
const ProfilePage = lazy(() => import("./pages/profile/Profile"));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <PrivateRoute>
                      <OrderDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/wishlists"
                  element={
                    <PrivateRoute>
                      <WishlistsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/wishlists/:id"
                  element={
                    <PrivateRoute>
                      <WishlistDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/items/new"
                  element={
                    <PrivateRoute>
                      <CreateItem />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/items/:id/edit"
                  element={
                    <PrivateRoute>
                      <EditItem />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Navigate to="/admin/items" replace />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/items"
                  element={
                    <AdminRoute>
                      <ManageItems />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/register"
                  element={
                    <PublicRoute>
                      <AdminRegister />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
