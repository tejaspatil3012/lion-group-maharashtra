import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { Quote, ArrowRight, Award } from "lucide-react";

export const PresidentSpotlight = ({ homeData }) => {
  const { lang, t } = useLanguage();

  const presidentName = lang === "mr"
    ? (homeData?.presidentNameMarathi || "श्री. चंद्रकांत (दादा) पाटील")
    : (homeData?.presidentNameEnglish || "Shri. Chandrakant (Dada) Patil");

  const presidentMsg = lang === "mr"
    ? (homeData?.presidentMessageMarathi || t.hero.description)
    : (homeData?.presidentMessageEnglish || t.hero.description);

  return (
    <section className="section section-cream">
      <div className="container">
        <div style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(212, 175, 55, 0.3)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "var(--shadow-xl)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            alignItems: "center"
          }} className="president-grid">
            {/* Left: Portrait & Badge */}
            <div style={{
              position: "relative",
              height: "100%",
              minHeight: "360px",
              background: "linear-gradient(135deg, #070D1E 0%, #132347 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "2rem"
            }}>
              <img
                src={homeData?.presidentPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"}
                alt={presidentName}
                style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid var(--primary-gold)",
                  boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)"
                }}
              />
              <div style={{
                position: "absolute",
                bottom: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: "rgba(7, 13, 30, 0.9)",
                padding: "0.4rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--primary-gold)",
                color: "var(--primary-gold)",
                fontSize: "0.825rem",
                fontWeight: 700
              }}>
                <Award size={14} />
                <span>{t.president.designation}</span>
              </div>
            </div>

            {/* Right: Message Content */}
            <div style={{ padding: "3rem 2.5rem" }}>
              <div className="section-badge" style={{ marginBottom: "0.75rem" }}>
                📜 {t.president.sectionBadge}
              </div>

              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.75rem, 3vw, 2.35rem)",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "0.5rem",
                lineHeight: 1.25
              }}>
                {presidentName}
              </h2>

              <div style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--primary-gold-dark)",
                marginBottom: "1.5rem"
              }}>
                {t.president.designation}, लायन ग्रुप महाराष्ट्र राज्य
              </div>

              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <Quote size={32} color="rgba(212, 175, 55, 0.3)" style={{ position: "absolute", top: "-10px", left: "-15px" }} />
                <p style={{
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  position: "relative",
                  zIndex: 2,
                  fontStyle: "italic",
                  paddingLeft: "1.25rem"
                }}>
                  "{presidentMsg}"
                </p>
              </div>

              <Link to="/leadership" className="btn btn-gold" style={{ padding: "0.75rem 1.75rem" }}>
                <span>{t.president.readFullMessage}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .president-grid {
            grid-template-columns: 0.8fr 1.2fr !important;
          }
        }
      `}</style>
    </section>
  );
};
