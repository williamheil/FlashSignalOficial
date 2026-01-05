import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import SignalsPage from "@/pages/SignalsPage";
import AlertsPage from "@/pages/AlertsPage";
import P2PPage from "@/pages/P2PPage";
import ArbitragePage from "@/pages/ArbitragePage";
import PortfolioPage from "@/pages/PortfolioPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PremiumGate from "@/components/auth/PremiumGate";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const checkSession = useStore((state) => state.checkSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkSession().finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, [checkSession]);

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-background-primary text-text-primary font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!session ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes Layout */}
          <Route element={
            session ? (
              <>
                <Navbar user={session?.user} />
                <main>
                  <Outlet />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signals" element={<SignalsPage />} />
            <Route path="/p2p" element={<P2PPage />} />
            <Route path="/arbitrage" element={<ArbitragePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/alerts" element={<PremiumGate><AlertsPage /></PremiumGate>} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
