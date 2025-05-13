
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginForm from "./pages/Login/LoginForm";
import Register from "./pages/Register";
import RegisterForm from "./pages/Register/RegisterForm";
import StudentSignup from "./pages/Signup/StudentSignup";
import ForgotPassword from "./pages/ForgotPassword";

// Student pages
import StudentDashboard from "./pages/Student/Dashboard";
import StudentPayment from "./pages/Student/Payment";
import StudentReports from "./pages/Student/Reports";
import StudentOrganization from "./pages/Student/Organization";
import StudentMessages from "./pages/Student/Messages";

// Supervisor pages
import SupervisorDashboard from "./pages/Supervisor/Dashboard";
import SupervisorStudents from "./pages/Supervisor/Students";
import SupervisorReports from "./pages/Supervisor/Reports";
import SupervisorMessages from "./pages/Supervisor/Messages";

// Coordinator pages
import CoordinatorDashboard from "./pages/Coordinator/Dashboard";
import AddSupervisor from "./pages/Coordinator/AddSupervisor";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:role" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/:role" element={<RegisterForm />} />
            <Route path="/signup/student" element={<StudentSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/payment" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPayment />
              </ProtectedRoute>
            } />
            <Route path="/student/reports" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentReports />
              </ProtectedRoute>
            } />
            <Route path="/student/organization" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentOrganization />
              </ProtectedRoute>
            } />
            <Route path="/student/messages" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMessages />
              </ProtectedRoute>
            } />

            {/* Supervisor Routes */}
            <Route path="/supervisor/dashboard" element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/students" element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorStudents />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/reports" element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorReports />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/messages" element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorMessages />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/messages/:studentId" element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorMessages />
              </ProtectedRoute>
            } />

            {/* Coordinator Routes */}
            <Route path="/coordinator/dashboard" element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/coordinator/add-supervisor" element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <AddSupervisor />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
