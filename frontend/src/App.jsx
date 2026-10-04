import "./App.css";
import { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProductCatalog from "./pages/customer/ProductCatalog";
import MyOrders from "./pages/customer/MyOrders";
import CartModal from "./pages/customer/CartModal";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import IncomingOrders from "./pages/seller/IncomingOrders";
import SalesHistory from "./pages/seller/SalesHistory";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import InventoryOverview from "./pages/buyer/InventoryOverview";
import LowStockAlerts from "./pages/buyer/LowStockAlerts";
import InwardStock from "./pages/buyer/InwardStock";

// Preserved Existing Pages (accessible by Buyer/Inventory Manager)
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import PurchaseItems from "./pages/PurchaseItems";

function MainApp() {
  const { user } = useAuth();

  const getDefaultPage = (role) => {
    switch (role) {
      case "SELLER":
        return "seller-dashboard";
      case "BUYER":
        return "buyer-dashboard";
      case "CUSTOMER":
      default:
        return "customer-dashboard";
    }
  };

  const [page, setPage] = useState("customer-dashboard");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setPage(getDefaultPage(user.role));
    }
  }, [user?.role]);

  if (!user) {
    return <Login />;
  }

  // Cart operations for Customer
  const handleAddToCart = (newItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === newItem.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const renderContent = () => {
    // CUSTOMER PAGES
    if (user.role === "CUSTOMER") {
      switch (page) {
        case "customer-catalog":
          return <ProductCatalog onAddToCart={handleAddToCart} cart={cart} />;
        case "customer-orders":
          return <MyOrders />;
        case "customer-dashboard":
        default:
          return <CustomerDashboard onNavigate={(p) => setPage(p === "catalog" ? "customer-catalog" : "customer-orders")} />;
      }
    }

    // SELLER PAGES
    if (user.role === "SELLER") {
      switch (page) {
        case "seller-orders":
          return <IncomingOrders />;
        case "seller-sales":
          return <SalesHistory />;
        case "seller-catalog":
          return <InventoryOverview onNavigate={(p) => setPage(p)} />;
        case "seller-dashboard":
        default:
          return (
            <SellerDashboard
              onNavigate={(p) =>
                setPage(p === "orders" ? "seller-orders" : "seller-sales")
              }
            />
          );
      }
    }

    // BUYER PAGES
    if (user.role === "BUYER") {
      switch (page) {
        case "buyer-inventory":
          return <InventoryOverview onNavigate={(p) => setPage(p === "inward" ? "buyer-inward" : "manage-products")} />;
        case "buyer-low-stock":
          return <LowStockAlerts onNavigate={() => setPage("buyer-inward")} />;
        case "buyer-inward":
          return <InwardStock />;
        case "manage-products":
          return <Products />;
        case "manage-categories":
          return <Categories />;
        case "manage-suppliers":
          return <Suppliers />;
        case "manage-purchases":
          return <Purchases />;
        case "manage-purchase-items":
          return <PurchaseItems />;
        case "buyer-dashboard":
        default:
          return (
            <BuyerDashboard
              onNavigate={(p) => {
                if (p === "inward") setPage("buyer-inward");
                else if (p === "low-stock") setPage("buyer-low-stock");
                else if (p === "inventory") setPage("buyer-inventory");
                else if (p === "suppliers") setPage("manage-suppliers");
                else if (p === "purchases") setPage("manage-purchases");
              }}
            />
          );
      }
    }

    return <div>Select a page from the sidebar navigation.</div>;
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="app-body">
        <aside className="sidebar">
          {/* CUSTOMER NAVIGATION */}
          {user.role === "CUSTOMER" && (
            <nav>
              <div className="sidebar-heading">Customer Portal</div>
              <p
                className={page === "customer-dashboard" ? "active" : ""}
                onClick={() => setPage("customer-dashboard")}
              >
                📊 Dashboard
              </p>
              <p
                className={page === "customer-catalog" ? "active" : ""}
                onClick={() => setPage("customer-catalog")}
              >
                🛍️ Browse Products
              </p>
              <p
                className={page === "customer-orders" ? "active" : ""}
                onClick={() => setPage("customer-orders")}
              >
                📦 My Orders
              </p>
            </nav>
          )}

          {/* SELLER NAVIGATION */}
          {user.role === "SELLER" && (
            <nav>
              <div className="sidebar-heading">Seller Portal</div>
              <p
                className={page === "seller-dashboard" ? "active" : ""}
                onClick={() => setPage("seller-dashboard")}
              >
                📊 Seller Dashboard
              </p>
              <p
                className={page === "seller-orders" ? "active" : ""}
                onClick={() => setPage("seller-orders")}
              >
                📥 Incoming Orders
              </p>
              <p
                className={page === "seller-sales" ? "active" : ""}
                onClick={() => setPage("seller-sales")}
              >
                📈 Sales Ledger
              </p>
              <p
                className={page === "seller-catalog" ? "active" : ""}
                onClick={() => setPage("seller-catalog")}
              >
                📦 Product Catalog
              </p>
            </nav>
          )}

          {/* BUYER / INVENTORY MANAGER NAVIGATION */}
          {user.role === "BUYER" && (
            <nav>
              <div className="sidebar-heading">Buyer / Restocking</div>
              <p
                className={page === "buyer-dashboard" ? "active" : ""}
                onClick={() => setPage("buyer-dashboard")}
              >
                📊 Buyer Dashboard
              </p>
              <p
                className={page === "buyer-inventory" ? "active" : ""}
                onClick={() => setPage("buyer-inventory")}
              >
                📦 Stock Inventory
              </p>
              <p
                className={page === "buyer-low-stock" ? "active" : ""}
                onClick={() => setPage("buyer-low-stock")}
              >
                ⚠️ Low Stock Alerts
              </p>
              <p
                className={page === "buyer-inward" ? "active" : ""}
                onClick={() => setPage("buyer-inward")}
              >
                📥 Inward Stock (PO)
              </p>

              <div className="sidebar-heading">Inventory Config</div>
              <p
                className={page === "manage-products" ? "active" : ""}
                onClick={() => setPage("manage-products")}
              >
                🏷️ Products
              </p>
              <p
                className={page === "manage-categories" ? "active" : ""}
                onClick={() => setPage("manage-categories")}
              >
                🗂️ Categories
              </p>
              <p
                className={page === "manage-suppliers" ? "active" : ""}
                onClick={() => setPage("manage-suppliers")}
              >
                🏭 Suppliers
              </p>
              <p
                className={page === "manage-purchases" ? "active" : ""}
                onClick={() => setPage("manage-purchases")}
              >
                📜 Purchases
              </p>
              <p
                className={page === "manage-purchase-items" ? "active" : ""}
                onClick={() => setPage("manage-purchase-items")}
              >
                📋 Purchase Items
              </p>
            </nav>
          )}
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>

      {isCartOpen && (
        <CartModal
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onClose={() => setIsCartOpen(false)}
          onOrderPlaced={() => setPage("customer-orders")}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;