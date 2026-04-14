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
  return (
    <BrowserRouter>
      {/* Global wrapper with a beautiful rich mesh gradient background */}
      <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-100 via-indigo-50 to-cyan-100 text-gray-800 selection:bg-violet-300 selection:text-violet-900 relative overflow-x-hidden">
        
        {/* Soft animated background blobs for extreme premium feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 blur-[100px] mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-indigo-400/30 to-cyan-400/30 blur-[100px] mix-blend-multiply pointer-events-none"></div>

        {/* Global Navigation Bar */}
        <Navbar />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* STRICTLY USER PROTECTED ROUTES */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><Dashboard /></ProtectedRoute>} />
            <Route path="/seats/:eventId" element={<ProtectedRoute allowedRoles={['user']}><SeatSelection /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute allowedRoles={['user']}><Wallet /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><BookingHistory /></ProtectedRoute>} />
            
            {/* STRICTLY ADMIN PROTECTED ROUTES */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><AdminTransactions /></ProtectedRoute>} />
            <Route path="/admin/refunds" element={<ProtectedRoute allowedRoles={['admin']}><AdminRefundRequests /></ProtectedRoute>} />
            
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
