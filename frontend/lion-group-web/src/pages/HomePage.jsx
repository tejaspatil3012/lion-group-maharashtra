import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { homeService } from "../services/homeService";
import { HeroSection } from "../components/home/HeroSection";
import { StatCounters } from "../components/home/StatCounters";
import { CausesSection } from "../components/home/CausesSection";
import { PresidentSpotlight } from "../components/home/PresidentSpotlight";
import { ActivityCard } from "../components/activities/ActivityCard";
import { EventCard } from "../components/events/EventCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { ArrowRight, Image as ImageIcon, Calendar, Phone, Heart } from "lucide-react";

export const HomePage = () => {
  const { lang, t } = useLanguage();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (err) {
      console.error("Error fetching homepage data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHomeData} />;

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection homeData={homeData} />

      {/* 2. Impact Counters */}
      <StatCounters homeData={homeData} />

      {/* 3. Four Core Causes */}
      <CausesSection />

      {/* 4. President's Message Spotlight */}
      <PresidentSpotlight homeData={homeData} />

      {/* 5. Featured Social Activities */}
      {homeData?.featuredActivities && homeData.featuredActivities.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div>
                <div className="section-badge">
                  🦁 {t.activities.badge}
                </div>
                <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
                  {t.activities.title}
                </h2>
                <p className="section-subtitle">
                  {t.activities.subtitle}
                </p>
              </div>

              <Link to="/activities" className="btn btn-outline-gold" style={{ color: "var(--text-main)", borderColor: "var(--primary-gold-dark)" }}>
                <span>{t.activities.viewAll}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-3">
              {homeData.featuredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Upcoming Events */}
      {homeData?.upcomingEvents && homeData.upcomingEvents.length > 0 && (
        <section className="section section-dark">
          <div className="container">
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div>
                <div className="section-badge">
                  📅 {t.events.badge}
                </div>
                <h2 className="section-title" style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}>
                  {t.events.title}
                </h2>
                <p className="section-subtitle">
                  {t.events.subtitle}
                </p>
              </div>

              <Link to="/events" className="btn btn-gold">
                <span>{t.events.viewAll}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-3">
              {homeData.upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Gallery Snapshot Strip */}
      {homeData?.recentGalleryImages && homeData.recentGalleryImages.length > 0 && (
        <section className="section section-cream">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                📸 {t.gallery.badge}
              </div>
              <h2 className="section-title">
                {t.gallery.title}
              </h2>
              <p className="section-subtitle">
                {t.gallery.subtitle}
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem"
            }}>
              {homeData.recentGalleryImages.map((img) => (
                <Link
                  key={img.id}
                  to={`/gallery/${img.galleryAlbumId}`}
                  style={{
                    position: "relative",
                    height: "220px",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-md)",
                    display: "block"
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={lang === "mr" ? (img.captionMarathi || img.captionEnglish) : img.captionEnglish}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.25rem 1rem 0.75rem 1rem",
                    background: "linear-gradient(to top, rgba(7, 13, 30, 0.9) 0%, transparent 100%)",
                    color: "#FFFFFF",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}>
                    {lang === "mr" ? (img.captionMarathi || img.captionEnglish) : img.captionEnglish}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link to="/gallery" className="btn btn-gold" style={{ padding: "0.75rem 2rem" }}>
                <ImageIcon size={18} />
                <span>{t.gallery.viewAll}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. Call to Action / Helpline Strip */}
      <section style={{
        background: "linear-gradient(135deg, #070D1E 0%, #16284D 100%)",
        color: "#FFFFFF",
        padding: "4rem 0",
        borderTop: "1px solid rgba(212, 175, 55, 0.3)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.3)"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem"
          }}>
            <div>
              <div className="section-badge" style={{ marginBottom: "0.75rem" }}>
                🩸 24x7 {t.nav.emergency}
              </div>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "0.5rem"
              }}>
                {lang === "mr" ? "रक्त हवे असल्यास त्वरित संपर्क करा" : "Need Emergency Blood Support?"}
              </h2>
              <p style={{ color: "var(--text-light-muted)", fontSize: "1.05rem", maxWidth: "600px" }}>
                {lang === "mr"
                  ? "लायन ग्रुपचे राज्यभरातील स्वयंसेवक व रक्तपेढी समन्वय केंद्र २४ तास मदतीसाठी सज्ज आहे."
                  : "Our volunteer coordination network across Maharashtra is available 24x7 for urgent blood requests."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href={`tel:${(homeData?.emergencyBloodHelpline || "+91 9370078254").replace(/\s+/g, "")}`}
                className="btn btn-saffron"
                style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}
              >
                <Heart size={20} fill="#FFFFFF" />
                <span>{homeData?.emergencyBloodHelpline || "+91 9370078254"}</span>
              </a>

              <Link to="/contact" className="btn btn-outline-gold" style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}>
                <Phone size={18} />
                <span>{t.hero.contactUs}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
