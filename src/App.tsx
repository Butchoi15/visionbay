import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Search } from './pages/Search';
import { Returns } from './pages/Returns';
import { Contact } from './pages/Contact';
import { Installation } from './pages/Installation';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductForm } from './pages/AdminProductForm';
import { ForgotPassword } from './pages/ForgotPassword';
import { UserProfile } from './pages/UserProfile';
import { OrderStatus } from './pages/OrderStatus';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/:orderId" element={<Checkout />} />
              <Route path="/search" element={<Search />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/installation" element={<Installation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/order/:orderId" element={<OrderStatus />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products/:id" element={<AdminProductForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
