import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { Home } from "lucide-react";

export const NotFoundPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div style={{
      minHeight: "65vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "4rem 1.5rem"
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🦁</div>
      <h1 style={{
        fontFamily: "var(--font-heading)",
        fontSize: "3rem",
        fontWeight: 900,
        color: "var(--text-main)",
        marginBottom: "0.5rem"
      }}>
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary-gold-dark)", marginBottom: "1rem" }}>
        {lang === "mr" ? "पृष्ठ सापडले नाही" : "Page Not Found"}
      </h2>
      <p style={{ color: "var(--text-muted)", maxWidth: "450px", marginBottom: "2rem" }}>
        {lang === "mr"
          ? "आपण शोधत असलेले पृष्ठ उपलब्ध नाही किंवा काढण्यात आले आहे."
          : "The page you are looking for might have been moved or doesn't exist."}
      </p>
      <Link to="/" className="btn btn-gold">
        <Home size={18} />
        <span>{lang === "mr" ? "मुख्यपृष्ठावर परत जा" : "Back to Home"}</span>
      </Link>
    </div>
  );
};
