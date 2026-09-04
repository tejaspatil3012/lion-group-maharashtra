import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { contactService } from "../../services/contactService";
import { Phone, Heart, Globe, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await contactService.getContactInfo();
        if (data) setContactInfo(data);
      } catch (err) {
        // Fallback silently
      }
    };
    fetchContact();
  }, []);

  const helpline = contactInfo?.emergencyBloodHelpline || "+91 9370078254";
  const primaryPhone = contactInfo?.primaryPhone || "+91 9370078254";

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/leadership", label: t.nav.leadership },
    { to: "/members", label: t.nav.members },
    { to: "/be-a-member", label: lang === "mr" ? "सदस्य व्हा" : "Be A Member" },
    { to: "/activities", label: t.nav.activities },
    { to: "/events", label: t.nav.events },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/donate", label: t.nav.donate },
    { to: "/contact", label: t.nav.contact }
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backgroundColor: "#070D1E",
      boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "none",
      transition: "box-shadow 0.3s ease"
    }}>
      {/* Top Banner: Emergency Blood Helpline & Lang Toggle */}
      <div style={{
        backgroundColor: "#0B1528",
        borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
        padding: "0.4rem 0",
        fontSize: "0.85rem",
        color: "var(--text-light-muted)"
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          {/* Left: Blood Helpline Alert */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#F87171", fontWeight: 600 }}>
              <Heart size={14} fill="#EF4444" color="#EF4444" className="pulse-glow" />
              <span>{t.nav.emergency}:</span>
              <a href={`tel:${helpline.replace(/\s+/g, "")}`} style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 700 }}>
                {helpline}
              </a>
            </div>

            <div style={{ display: "none", alignItems: "center", gap: "0.4rem", color: "var(--text-light-muted)" }} className="hide-mobile">
              <Phone size={14} color="var(--primary-gold)" />
              <a href={`tel:${primaryPhone.replace(/\s+/g, "")}`} style={{ color: "var(--text-light-muted)", textDecoration: "none" }}>
                {primaryPhone}
              </a>
            </div>
          </div>

          {/* Right: Language Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={toggleLanguage}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--primary-gold)",
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                color: "var(--primary-gold)",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title="Toggle Language"
            >
              <Globe size={14} />
              <span>{lang === "mr" ? "English" : "मराठी"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        padding: scrolled ? "0.6rem 0" : "0.9rem 0",
        transition: "padding 0.3s ease"
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Organization Logo & Brand Title */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.85rem", textDecoration: "none" }}>
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F5C542 0%, #D4AF37 50%, #8C6D12 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(212, 175, 55, 0.4)",
              flexShrink: 0
            }}>
              <span style={{ fontSize: "1.5rem" }}>🦁</span>
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "1.25rem",
                color: "#FFFFFF",
                letterSpacing: "0.02em",
                lineHeight: 1.15
              }}>
                LION GROUP
              </div>
              <div style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary-gold)",
                letterSpacing: "0.04em"
              }}>
                {lang === "mr" ? "महाराष्ट्र राज्य (रजि.)" : "MAHARASHTRA RAJYA"}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{
            display: "none",
            alignItems: "center",
            gap: "0.35rem"
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary-gold)" : "#E2E8F0",
                  textDecoration: "none",
                  borderRadius: "var(--radius-md)",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "rgba(212, 175, 55, 0.12)" : "transparent",
                  borderBottom: isActive ? "2px solid var(--primary-gold)" : "2px solid transparent"
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/donate"
              className="btn btn-gold"
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1.15rem",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "linear-gradient(135deg, #E63946 0%, #D4AF37 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700
              }}
            >
              <Heart size={15} fill="#FFFFFF" />
              {t.nav.donate}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "var(--radius-md)",
              color: "var(--primary-gold)",
              padding: "0.5rem",
              cursor: "pointer"
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: "#0B1528",
          borderTop: "1px solid rgba(212, 175, 55, 0.2)",
          padding: "1.25rem 1.5rem 2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: "0.75rem 1rem",
                fontSize: "1.05rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--primary-gold)" : "#FFFFFF",
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
                backgroundColor: isActive ? "rgba(212, 175, 55, 0.15)" : "transparent",
                borderLeft: isActive ? "4px solid var(--primary-gold)" : "4px solid transparent"
              })}
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-gold"
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #E63946 0%, #D4AF37 100%)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 700
            }}
          >
            <Heart size={18} fill="#FFFFFF" />
            {t.nav.donate}
          </Link>
        </div>
      )}

      {/* Inline styles for responsive CSS classes */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .hide-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
