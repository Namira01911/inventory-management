import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Authentication failed";
      setError(typeof msg === "string" ? msg : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegister(false);
    setError("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Inventory Management</h2>
          <p className="subtitle">
            {isRegister ? "Create a Customer Account" : "Sign in to access your dashboard"}
          </p>
        </div>

        <div className="tab-buttons">
          <button
            type="button"
            className={`tab-btn ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            Register (Customer)
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <p className="register-notice">
              ℹ️ Public registration creates a <strong>Customer</strong> account. Seller and Buyer accounts are managed administratively.
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Create Customer Account" : "Sign In"}
          </button>
        </form>

        <div className="demo-accounts-box">
          <p className="demo-title">Quick Demo Login Accounts:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-badge demo-seller"
              onClick={() => handleDemoFill("seller@inventory.com", "Seller@123")}
            >
              Seller
            </button>
            <button
              type="button"
              className="demo-badge demo-buyer"
              onClick={() => handleDemoFill("buyer@inventory.com", "Buyer@123")}
            >
              Buyer / Inv Mgr
            </button>
            <button
              type="button"
              className="demo-badge demo-customer"
              onClick={() => handleDemoFill("customer@inventory.com", "Customer@123")}
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
