import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { ArrowRight, ShieldCheck, Heart, Users, Sparkles } from "lucide-react";

export const HeroSection = ({ homeData }) => {
  const { lang, t } = useLanguage();

  return (
    <section style={{
      position: "relative",
      background: "radial-gradient(ellipse at 80% 20%, #16284D 0%, #0B1528 40%, #070D1E 100%)",
      color: "#FFFFFF",
      padding: "5rem 0 6.5rem 0",
      overflow: "hidden",
      borderBottom: "2px solid rgba(212, 175, 55, 0.25)"
    }}>
      {/* Background Decorative Gold Orbs */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "550px",
        height: "550px",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "absolute",
        bottom: "-15%",
        left: "-10%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(232, 93, 4, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3.5rem",
          alignItems: "center"
        }} className="hero-grid">
          {/* Left Column: Mission & CTA */}
          <div>
            {/* Top State Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(212, 175, 55, 0.12)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              borderRadius: "var(--radius-full)",
              color: "var(--primary-gold)",
              fontSize: "0.875rem",
              fontWeight: 700,
              marginBottom: "1.5rem"
            }}>
              <span>🚩</span>
              <span>{lang === "mr" ? "महाराष्ट्र राज्य सामाजिक संघटन" : "Maharashtra State Social Organization"}</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              color: "#FFFFFF",
              letterSpacing: "-0.01em"
            }}>
              {lang === "mr" ? (
                <>
                  लायन ग्रुप <span className="text-gold-gradient">महाराष्ट्र राज्य</span>
                </>
              ) : (
                <>
                  LION GROUP <span className="text-gold-gradient">MAHARASHTRA RAJYA</span>
                </>
              )}
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
              fontWeight: 600,
              color: "var(--primary-gold-light)",
              marginBottom: "1rem",
              lineHeight: 1.4
            }}>
              {homeData?.taglineMarathi && lang === "mr"
                ? homeData.taglineMarathi
                : (homeData?.taglineEnglish || t.hero.subtitle)}
            </p>

            {/* Description */}
            <p style={{
              fontSize: "1.05rem",
              color: "var(--text-light-muted)",
              lineHeight: 1.75,
              marginBottom: "2.25rem",
              maxWidth: "640px"
            }}>
              {t.hero.description}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem"
            }}>
              <Link to="/activities" className="btn btn-gold" style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }}>
                <span>{t.hero.exploreWork}</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/contact" className="btn btn-outline-gold" style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}>
                <span>{t.hero.contactUs}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Crest & Highlights Card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "440px",
              background: "linear-gradient(145deg, rgba(19, 35, 71, 0.85) 0%, rgba(11, 21, 40, 0.95) 100%)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.15)",
              textAlign: "center"
            }}>
              {/* Lion Crest Icon */}
              <div style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #8C6D12 100%)",
                margin: "0 auto 1.5rem auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)"
              }}>
                <span style={{ fontSize: "3.2rem" }}>🦁</span>
              </div>

              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "0.5rem"
              }}>
                {lang === "mr" ? "एकता • सेवा • समर्पण" : "UNITY • SERVICE • DEDICATION"}
              </h3>

              <p style={{
                fontSize: "0.9rem",
                color: "var(--text-light-muted)",
                marginBottom: "1.75rem",
                lineHeight: 1.6
              }}>
                {lang === "mr"
                  ? "महाराष्ट्रभरातील हजारो समर्पित स्वयंसेवक आणि ३६ जिल्ह्यांमध्ये निरंतर समाजसेवा."
                  : "Thousands of dedicated volunteers serving relentlessly across all 36 districts of Maharashtra."}
              </p>

              {/* Pillars Badges */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "0.75rem",
                textAlign: "left"
              }}>
                <div style={{
                  padding: "0.75rem",
                  backgroundColor: "rgba(230, 57, 70, 0.12)",
                  border: "1px solid rgba(230, 57, 70, 0.25)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>🩸</span>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FCA5A5" }}>
                    {lang === "mr" ? "रक्तदान शिबिरे" : "Blood Camps"}
                  </div>
                </div>

                <div style={{
                  padding: "0.75rem",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>🌱</span>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6EE7B7" }}>
                    {lang === "mr" ? "वृक्षारोपण मोहीम" : "Tree Plantation"}
                  </div>
                </div>

                <div style={{
                  padding: "0.75rem",
                  backgroundColor: "rgba(59, 130, 246, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>🏥</span>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#93C5FD" }}>
                    {lang === "mr" ? "आरोग्य तपासणी" : "Health Relief"}
                  </div>
                </div>

                <div style={{
                  padding: "0.75rem",
                  backgroundColor: "rgba(234, 88, 12, 0.12)",
                  border: "1px solid rgba(234, 88, 12, 0.25)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>🍲</span>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FDBA74" }}>
                    {lang === "mr" ? "अन्नदान व मदत" : "Food Relief"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </section>
  );
};
