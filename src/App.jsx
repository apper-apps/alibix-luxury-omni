import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Placeholder Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon />
          <h1 className="text-xl font-bold text-primary">Alibix Luxury</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-gray-600 hover:text-primary transition-colors">Home</a>
          <a href="/categories" className="text-gray-600 hover:text-primary transition-colors">Categories</a>
          <a href="/cart" className="text-gray-600 hover:text-primary transition-colors">Cart</a>
          <a href="/profile" className="text-gray-600 hover:text-primary transition-colors">Profile</a>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

// Placeholder Page Components
const Home = () => (
  <div className="text-center">
    <h2 className="text-3xl font-bold mb-4 gradient-text">Welcome to Alibix Luxury</h2>
    <p className="text-gray-600 mb-8">Your premium shopping destination</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="product-card p-6">
        <h3 className="text-xl font-semibold mb-2">Featured Products</h3>
        <p className="text-gray-600">Discover our latest collection</p>
      </div>
      <div className="product-card p-6">
        <h3 className="text-xl font-semibold mb-2">Best Sellers</h3>
        <p className="text-gray-600">Popular items from our store</p>
      </div>
      <div className="product-card p-6">
        <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
        <p className="text-gray-600">Fresh products just for you</p>
      </div>
    </div>
  </div>
);

const Categories = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Categories</h2>
    <div className="category-grid">
      <div className="category-card">
        <h3 className="font-semibold">Electronics</h3>
      </div>
      <div className="category-card">
        <h3 className="font-semibold">Fashion</h3>
      </div>
      <div className="category-card">
        <h3 className="font-semibold">Home & Garden</h3>
      </div>
      <div className="category-card">
        <h3 className="font-semibold">Sports</h3>
      </div>
    </div>
  </div>
);

const ProductDetail = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Product Details</h2>
    <p className="text-gray-600">Product details will be displayed here.</p>
  </div>
);

const Cart = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
    <p className="text-gray-600">Your cart is empty.</p>
  </div>
);

const Checkout = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Checkout</h2>
    <p className="text-gray-600">Checkout process will be available here.</p>
  </div>
);

const Orders = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Order History</h2>
    <p className="text-gray-600">Your orders will be displayed here.</p>
  </div>
);

const Profile = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Profile</h2>
    <p className="text-gray-600">Manage your account settings.</p>
  </div>
);

const Admin = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
    <p className="text-gray-600">Admin functionality will be available here.</p>
  </div>
);
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ErrorBoundary>
);
}

export default App;