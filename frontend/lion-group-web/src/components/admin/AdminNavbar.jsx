import React from "react";
import { Menu, Home, ExternalLink, Shield, LogOut } from "lucide-react";

export const AdminNavbar = ({ onToggleSidebar, onLogout }) => {
  return (
    <header style={{
      height: "64px",
      backgroundColor: "#070D1E",
      borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
      position: "sticky",
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-ghost"
          style={{ padding: "0.5rem", color: "#F8FAFC" }}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            backgroundColor: "rgba(212, 175, 55, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary-gold)"
          }}>
            <Shield size={16} />
          </div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#F8FAFC", fontFamily: "var(--font-heading)" }}>
            Lion Group Admin Portal
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-gold"
          style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Home size={15} />
          <span>Live Website</span>
          <ExternalLink size={13} />
        </a>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-ghost"
            title="Lock / Logout"
            style={{ padding: "0.45rem 0.75rem", fontSize: "0.85rem", color: "#EF4444", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <LogOut size={16} />
            <span>Lock</span>
          </button>
        )}
      </div>
    </header>
  );
};
