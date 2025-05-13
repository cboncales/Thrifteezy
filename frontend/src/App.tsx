import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Suspense, lazy } from "react";
import { Layout } from "./components/layout";
import { Home } from "./pages/Home";
import { Items } from "./pages/Items";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Orders } from "./pages/orders/Orders";
import { OrderDetails } from "./pages/orders/OrderDetails";
import { Wishlists } from "./pages/wishlists/Wishlists";
import { WishlistDetails } from "./pages/wishlists/WishlistDetails";
import { PrivateRoute } from "./components/auth/PrivateRoute";

// Layout components
const LayoutComponent = lazy(() => import("./components/layout/Layout"));

// Auth pages
const HomePage = lazy(() => import("./pages/Home"));
const ItemsPage = lazy(() => import("./pages/items/Items"));
const ItemDetails = lazy(() => import("./pages/items/ItemDetails"));
const CreateItem = lazy(() => import("./pages/items/CreateItem"));
const EditItem = lazy(() => import("./pages/items/EditItem"));
const WishlistsPage = lazy(() => import("./pages/wishlists/Wishlists"));
const Profile = lazy(() => import("./pages/profile/Profile"));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<Items />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
                    <Wishlists />
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
            </Routes>
          </Layout>
          <Routes>
            {/* Protected routes */}
            <Route path="/" element={<LayoutComponent />}>
              <Route index element={<HomePage />} />
              <Route path="items">
                <Route index element={<ItemsPage />} />
                <Route path=":id" element={<ItemDetails />} />
                <Route path="create" element={<CreateItem />} />
                <Route path=":id/edit" element={<EditItem />} />
              </Route>
              <Route path="wishlists">
                <Route index element={<WishlistsPage />} />
              </Route>
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
