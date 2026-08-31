import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminNavbar } from "../components/admin/AdminNavbar";
import { Lock, KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const authStatus = sessionStorage.getItem("lion_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === "1221") {
      sessionStorage.setItem("lion_admin_auth", "true");
      setIsAuthenticated(true);
      setErrorMsg("");
      setPasswordInput("");
    } else {
      setErrorMsg("Incorrect Password (चुकाचा पासवर्ड).");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("lion_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // If Not Authenticated -> Show Password Screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#050914",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(5, 9, 20, 0) 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none"
        }} />

        <div style={{
          backgroundColor: "#0B1528",
          border: "1.5px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "20px",
          maxWidth: "420px",
          width: "100%",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
          textAlign: "center",
          position: "relative",
          zIndex: 10
        }}>
          {/* Lion Logo */}
          <div style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "var(--gradient-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1.25rem auto",
            boxShadow: "0 8px 24px rgba(212, 175, 55, 0.35)"
          }}>
            🦁
          </div>

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Admin Portal Access
          </h2>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
            Enter your security PIN to access management dashboard.
          </p>

          {errorMsg && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#FCA5A5",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1.25rem",
              fontSize: "0.85rem"
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <KeyRound
                size={18}
                color="var(--primary-gold)"
                style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                required
                autoFocus
                placeholder="Enter PIN (पासवर्ड)..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem", fontSize: "1.05rem", letterSpacing: "2px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-light-muted)",
                  cursor: "pointer",
                  padding: "0.25rem"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.95rem", justifyContent: "center" }}
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: "1rem" }}>
            <a
              href="/"
              style={{ fontSize: "0.85rem", color: "var(--text-light-muted)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light-muted)")}
            >
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Screen
  return (
    <div className="admin-shell" style={{ minHeight: "100vh", backgroundColor: "#050914", color: "#F8FAFC", display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => window.innerWidth < 1024 && setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen && window.innerWidth >= 1024 ? "260px" : 0,
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#050914"
      }}>
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <main style={{ flex: 1, padding: "1.75rem", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
