import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

export const LoadingSpinner = ({ message }) => {
  const { t } = useLanguage();
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ marginTop: "1.25rem", color: "var(--text-muted)", fontWeight: 500 }}>
        {message || t.common.loading}
      </p>
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div style={{
      textAlign: "center",
      padding: "3rem 1.5rem",
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      borderRadius: "var(--radius-lg)",
      maxWidth: "500px",
      margin: "2rem auto"
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
      <h3 style={{ color: "#991B1B", marginBottom: "0.5rem", fontWeight: 700 }}>
        {message || t.common.errorLoading}
      </h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-gold"
          style={{ marginTop: "1rem", fontSize: "0.9rem", padding: "0.5rem 1.25rem" }}
        >
          🔄 {t.common.backToList || "Retry"}
        </button>
      )}
    </div>
  );
};
