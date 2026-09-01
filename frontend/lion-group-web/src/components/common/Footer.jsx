import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { contactService } from "../../services/contactService";
import { MapPin, Phone, Mail, Heart, ChevronRight, Award } from "lucide-react";

export const Footer = () => {
  const { lang, t } = useLanguage();
  const [contactInfo, setContactInfo] = useState(null);

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

  const primaryPhone = contactInfo?.primaryPhone || "+91 9370078254";
  const helpline = contactInfo?.emergencyBloodHelpline || "+91 9370078254";
  const primaryEmail = contactInfo?.primaryEmail || "contact@liongroupmaharashtra.org";
  const address = lang === "mr"
    ? (contactInfo?.headOfficeAddressMarathi || "लायन ग्रुप राज्य मुख्य कार्यालय, चौधरी वाडा, किनगाव, ता. यावल, जि. जळगाव")
    : (contactInfo?.headOfficeAddressEnglish || "Lion Group HQ Chaudhari wada Kingaon, Maharashtra");

  return (
    <footer style={{
      backgroundColor: "#050A18",
      color: "#E2E8F0",
      borderTop: "3px solid var(--primary-gold)",
      paddingTop: "4.5rem",
      paddingBottom: "2rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "3rem",
          marginBottom: "3.5rem"
        }}>
          {/* Column 1: Organization Summary */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F5C542 0%, #D4AF37 50%, #8C6D12 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(212, 175, 55, 0.4)"
              }}>
                <span style={{ fontSize: "1.6rem" }}>🦁</span>
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  color: "#FFFFFF",
                  lineHeight: 1.15
                }}>
                  LION GROUP
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--primary-gold)", fontWeight: 600 }}>
                  {lang === "mr" ? "महाराष्ट्र राज्य (रजि.)" : "MAHARASHTRA RAJYA"}
                </div>
              </div>
            </div>

            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-light-muted)",
              lineHeight: 1.7,
              marginBottom: "1.5rem"
            }}>
              {t.footer.aboutText}
            </p>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.85rem",
              backgroundColor: "rgba(212, 175, 55, 0.12)",
              border: "1px solid var(--border-gold)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              color: "var(--primary-gold)",
              fontWeight: 600
            }}>
              <Award size={14} />
              <span>{lang === "mr" ? "महाराष्ट्र शासन नोंदणीकृत सामाजिक संस्था" : "Govt. Registered NGO"}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
              fontFamily: "var(--font-heading)",
              borderLeft: "3px solid var(--primary-gold)",
              paddingLeft: "0.75rem"
            }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { to: "/", label: t.nav.home },
                { to: "/about", label: t.nav.about },
                { to: "/leadership", label: t.nav.leadership },
                { to: "/members", label: t.nav.members },
                { to: "/events", label: t.nav.events },
                { to: "/gallery", label: t.nav.gallery },
                { to: "/contact", label: t.nav.contact }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    style={{
                      color: "var(--text-light-muted)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.925rem",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light-muted)")}
                  >
                    <ChevronRight size={14} color="var(--primary-gold)" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Causes */}
          <div>
            <h4 style={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
              fontFamily: "var(--font-heading)",
              borderLeft: "3px solid var(--primary-gold)",
              paddingLeft: "0.75rem"
            }}>
              {t.footer.coreCauses}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: t.causes.blood.title, icon: "🩸" },
                { label: t.causes.tree.title, icon: "🌱" },
                { label: t.causes.health.title, icon: "🏥" },
                { label: t.causes.food.title, icon: "🍲" }
              ].map((cause, idx) => (
                <li key={idx}>
                  <Link
                    to="/activities"
                    style={{
                      color: "var(--text-light-muted)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.925rem",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light-muted)")}
                  >
                    <span>{cause.icon}</span>
                    <span>{cause.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Helplines */}
          <div>
            <h4 style={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
              fontFamily: "var(--font-heading)",
              borderLeft: "3px solid var(--primary-gold)",
              paddingLeft: "0.75rem"
            }}>
              {t.footer.contactUs}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={18} color="var(--primary-gold)" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                <span style={{ color: "var(--text-light-muted)", lineHeight: 1.5 }}>
                  {address}
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={18} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
                <a href={`tel:${primaryPhone.replace(/\s+/g, "")}`} style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 600 }}>
                  {primaryPhone}
                </a>
              </div>

              <div style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                padding: "0.6rem 0.85rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-md)"
              }}>
                <Heart size={18} color="#EF4444" fill="#EF4444" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#FCA5A5", fontWeight: 600 }}>
                    {t.nav.emergency}
                  </div>
                  <a href={`tel:${helpline.replace(/\s+/g, "")}`} style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 700 }}>
                    {helpline}
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Mail size={18} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${primaryEmail}`} style={{ color: "var(--text-light-muted)", textDecoration: "none" }}>
                  {primaryEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.85rem",
          color: "var(--text-light-muted)"
        }}>
          <div>{t.footer.copyright}</div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link to="/admin" style={{ color: "var(--primary-gold)", textDecoration: "none", fontSize: "0.8rem", opacity: 0.85 }}>
              ⚙️ {lang === "mr" ? "व्यवस्थापक पोर्टल (Admin Portal)" : "Admin Portal"}
            </Link>
            <span style={{ color: "var(--primary-gold)" }}>🚩 जय महाराष्ट्र | जय हिंद 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
