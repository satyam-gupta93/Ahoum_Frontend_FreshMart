import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/ui/Toast';

// Auth / Onboarding Pages
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OtpPage } from './pages/OtpPage';
import { LocationPage } from './pages/LocationPage';

// Main App Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderFailurePage } from './pages/OrderFailurePage';
import { ProfilePage } from './pages/ProfilePage';

// Layout wrapper for standard app pages
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      {/* Desktop Sticky Header */}
      <TopNav />

      {/* Main Page Area */}
      <main className="flex-1 w-full bg-gray-50/50">
        <Outlet />
      </main>

      {/* Mobile Sticky Footer */}
      <BottomNav />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Full screen onboarding & authentication */}
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/location" element={<LocationPage />} />

        {/* Standard Shell Pages (wrapped with TopNav + BottomNav) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-failure" element={<OrderFailurePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback - Redirect to splash */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
