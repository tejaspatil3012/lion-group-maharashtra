import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Activity,
  Image as ImageIcon,
  Settings,
  Mail,
  Target,
  HeartHandshake,
  ExternalLink,
  ShieldCheck,
  LogOut
} from "lucide-react";

export const AdminSidebar = ({ isOpen, onClose, onLogout }) => {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/membership-requests", label: "Membership Requests", icon: UserPlus },
    { to: "/admin/members", label: "Members & Leadership", icon: Users },
    { to: "/admin/events", label: "Events & Conclaves", icon: Calendar },
    { to: "/admin/activities", label: "Social Activities", icon: Activity },
    { to: "/admin/campaigns", label: "Donation Campaigns", icon: Target },
    { to: "/admin/donations", label: "Donation Records", icon: HeartHandshake },
    { to: "/admin/gallery", label: "Photo Gallery", icon: ImageIcon },
    { to: "/admin/settings", label: "Organization Info", icon: Settings },
    { to: "/admin/inquiries", label: "Contact Inquiries", icon: Mail },
  ];

  return (
    <>
      {/* Mobile Backdrop only on screen width < 1024px */}
      {isOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: "260px",
          backgroundColor: "#070D1E",
          borderRight: "1px solid var(--border-gold)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: isOpen ? 0 : "-260px",
          zIndex: 50,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-gold)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "var(--gradient-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#070D1E",
            fontWeight: 900
          }}>
            🦁
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--primary-gold)",
              letterSpacing: "0.5px"
            }}>
              LION GROUP
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-light-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={12} color="#10B981" />
              <span>Admin Management</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "1.25rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem", overflowY: "auto" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  transition: "var(--transition)",
                  backgroundColor: isActive ? "rgba(212, 175, 55, 0.15)" : "transparent",
                  color: isActive ? "var(--primary-gold)" : "var(--text-light-muted)",
                  borderLeft: isActive ? "3px solid var(--primary-gold)" : "3px solid transparent"
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border-gold)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.6rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "var(--text-light)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            <ExternalLink size={15} />
            <span>View Public Website</span>
          </a>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="btn btn-ghost"
              style={{
                width: "100%",
                padding: "0.55rem",
                color: "#EF4444",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem"
              }}
            >
              <LogOut size={15} />
              <span>Lock Admin Portal</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
