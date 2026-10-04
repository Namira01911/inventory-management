import { useAuth } from "../context/AuthContext";

function Navbar({ cartCount, onOpenCart }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleBadge = (role) => {
    switch (role) {
      case "SELLER":
        return <span className="role-badge role-seller">SELLER</span>;
      case "BUYER":
        return <span className="role-badge role-buyer">BUYER</span>;
      case "CUSTOMER":
        return <span className="role-badge role-customer">CUSTOMER</span>;
      default:
        return <span className="role-badge">{role}</span>;
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-brand">
        <h2>Inventory Hub</h2>
      </div>

      <div className="navbar-user-section">
        {user.role === "CUSTOMER" && (
          <button className="cart-nav-btn" onClick={onOpenCart}>
            🛒 Cart ({cartCount})
          </button>
        )}

        <div className="user-profile-badge">
          <span className="user-name">{user.name}</span>
          {getRoleBadge(user.role)}
        </div>

        <button className="logout-btn" onClick={logout} title="Sign Out">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
