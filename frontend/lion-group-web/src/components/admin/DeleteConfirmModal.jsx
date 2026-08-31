import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-gold)",
        borderRadius: "var(--radius-lg)",
        maxWidth: "420px",
        width: "100%",
        padding: "1.75rem",
        boxShadow: "var(--shadow-xl)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#EF4444",
            flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
            {title || "Confirm Delete"}
          </h3>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.5 }}>
          {message || "Are you sure you want to delete this record? This action cannot be undone."}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#DC2626", color: "#FFFFFF", border: "none" }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
