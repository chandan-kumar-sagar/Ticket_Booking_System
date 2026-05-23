import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SeatSelection from "./pages/SeatSelection";
import Wallet from "./pages/Wallet";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminTransactions from "./pages/AdminTransactions";
import AdminRefundRequests from "./pages/AdminRefundRequests";
import Footer from "./components/Footer";

function App() {
  // Generate random static twinkling stars once with multi-frequency speeds and colors
  const stars = useMemo(() => {
    const starColors = ["bg-white", "bg-indigo-100", "bg-amber-50", "bg-cyan-100", "bg-violet-100"];
    const starTypes = ["animate-twinkle-fast", "animate-twinkle-medium", "animate-twinkle-slow"];
    return Array.from({ length: 130 }).map((_, i) => {
      const isLarge = Math.random() > 0.85;
      return {
        id: i,
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 98}%`,
        size: isLarge ? `${Math.random() * 1.5 + 2.5}px` : `${Math.random() * 1.5 + 1}px`,
        delay: `${Math.random() * 5}s`,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        type: starTypes[Math.floor(Math.random() * starTypes.length)],
        opacity: Math.random() * 0.4 + 0.5,
      };
    });
  }, []);

  return (
    <BrowserRouter>
      {/* Global wrapper with a beautiful dynamic animated celestial night sky */}
      <div className="min-h-screen flex flex-col night-sky-bg text-gray-800 dark:text-gray-100 selection:bg-violet-400/40 selection:text-violet-100 relative overflow-x-hidden transition-all duration-500">
        
        {/* Undulating Aurora Borealis (Northern Lights) Wave Curtains */}
        <div className="aurora-ribbon"></div>
        <div className="aurora-ribbon aurora-ribbon-2"></div>

        {/* Stars Background Overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className={`absolute rounded-full ${star.color} ${star.type}`}
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* Ethereal Glow Crescent Silver Moon */}
        <div className="absolute top-[8%] right-[10%] sm:right-[15%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-50/90 to-indigo-100/80 shadow-[0_0_50px_rgba(255,255,255,0.22)] pointer-events-none animate-moon-glow z-0">
          <div className="absolute top-[20%] left-[25%] w-3.5 h-3.5 rounded-full bg-indigo-200/30"></div>
          <div className="absolute bottom-[30%] left-[40%] w-2.5 h-2.5 rounded-full bg-indigo-200/30"></div>
          <div className="absolute top-[45%] right-[25%] w-4.5 h-4.5 rounded-full bg-indigo-200/30"></div>
        </div>

        {/* Gliding Shooting Stars (Meteors) - Supercharged Rapid Speed */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="shooting-star shooting-star-4"></div>
        <div className="shooting-star shooting-star-5"></div>

        {/* Soft floating cosmic nebulas / aurora clouds with dynamic shifting gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[18rem] sm:w-[28rem] lg:w-[35rem] h-[18rem] sm:h-[28rem] lg:h-[35rem] rounded-full bg-fuchsia-600/10 dark:bg-fuchsia-700/8 blur-[120px] pointer-events-none animate-float-1 z-0"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[22rem] sm:w-[32rem] lg:w-[40rem] h-[22rem] sm:h-[32rem] lg:h-[40rem] rounded-full bg-indigo-600/10 dark:bg-indigo-700/8 blur-[130px] pointer-events-none animate-float-2 z-0"></div>
        <div className="absolute top-[35%] left-[20%] w-[16rem] sm:w-[24rem] lg:w-[32rem] h-[16rem] sm:h-[24rem] lg:h-[32rem] rounded-full bg-cyan-600/8 dark:bg-cyan-700/6 blur-[110px] pointer-events-none animate-float-3 z-0"></div>

        {/* Global Navigation Bar */}
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* STRICTLY USER PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seats/:eventId"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />

            {/* STRICTLY ADMIN PROTECTED ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminRefundRequests />
                </ProtectedRoute>
              }
            />

            {/* Automatic Failover for unknown pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
