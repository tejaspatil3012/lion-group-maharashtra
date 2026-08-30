import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

export const PageHeader = ({ badge, title, subtitle, breadcrumb = [] }) => {
  const { t } = useLanguage();

  return (
    <div style={{
      background: "linear-gradient(180deg, #070D1E 0%, #0E1A33 60%, #132347 100%)",
      padding: "4rem 0 3.5rem 0",
      color: "#FFFFFF",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid rgba(212, 175, 55, 0.25)"
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: "absolute",
        top: "-40%",
        right: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Breadcrumb */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--text-light-muted)",
          marginBottom: "1rem"
        }}>
          <Link to="/" style={{ color: "var(--primary-gold)", textDecoration: "none" }}>
            {t.nav.home}
          </Link>
          <span>/</span>
          {breadcrumb.map((b, idx) => (
            <React.Fragment key={idx}>
              {b.link ? (
                <Link to={b.link} style={{ color: "var(--primary-gold)", textDecoration: "none" }}>
                  {b.label}
                </Link>
              ) : (
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{b.label}</span>
              )}
              {idx < breadcrumb.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Badge */}
        {badge && (
          <div className="section-badge" style={{ marginBottom: "0.75rem" }}>
            🦁 {badge}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          lineHeight: 1.2,
          marginBottom: "0.75rem",
          color: "#FFFFFF"
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: "1.125rem",
            color: "var(--text-light-muted)",
            maxWidth: "700px",
            lineHeight: 1.6
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
