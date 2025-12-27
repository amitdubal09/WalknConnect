import { memo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import Hero from "./components/Hero/hero.jsx";
import Whyus from "./components/Whyus/whyus.jsx";
import Footer from "./components/footer/footer.jsx";
//import Cards from "./components/cards/cards.jsx";
import About from "./pages/About/about.jsx";
import LogReg from "./pages/Auth/log-reg.jsx";
import Profile from "./pages/Profile/profile.jsx";
import UpdateProfile from "./pages/update-profile/update-profile.jsx";
import Walker from "./pages/walker/walker.jsx";


const App = () => {
  const isLoggedIn = () => !!localStorage.getItem("user");

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/logreg" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/logreg" element={<LogReg />} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />

        {/* Home route */}
        <Route path="/" element={
          <><Header /><Hero /><Whyus /><Footer /></>
        } />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <><Header /><Profile /></>
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <><Header /><UpdateProfile /></>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/walker"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Walker />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default memo(App);
