import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { eventService } from "../services/eventService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Calendar, MapPin, Clock, Award, ArrowLeft } from "lucide-react";

export const EventDetailPage = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error("Error loading event detail:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEvent} />;
  if (!event) return <ErrorMessage message="Event not found" />;

  const title = lang === "mr" ? (event.titleMarathi || event.titleEnglish) : event.titleEnglish;
  const description = lang === "mr" ? (event.descriptionMarathi || event.descriptionEnglish) : event.descriptionEnglish;

  const startDate = new Date(event.startDateTime);
  const formattedDate = startDate.toLocaleDateString(
    lang === "mr" ? "mr-IN" : "en-IN",
    { day: "numeric", month: "long", year: "numeric", weekday: "long" }
  );
  const formattedTime = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <PageHeader
        badge={event.status}
        title={title}
        subtitle={`${formattedDate} • ${event.venue}, ${event.district}`}
        breadcrumb={[
          { label: t.nav.events, link: "/events" },
          { label: title }
        ]}
      />

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          {/* Back Button */}
          <Link
            to="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary-gold-dark)",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginBottom: "2rem",
              textDecoration: "none"
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.common.backToList}</span>
          </Link>

          {/* Banner Photo */}
          <div style={{
            width: "100%",
            height: "420px",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-xl)",
            marginBottom: "2.5rem",
            backgroundColor: "#070D1E"
          }}>
            <img
              src={event.bannerImageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Event Schedule Bar */}
          <div style={{
            background: "#070D1E",
            color: "#FFFFFF",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            border: "1.5px solid rgba(212, 175, 55, 0.3)"
          }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                {lang === "mr" ? "तारीख" : "Date"}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-gold)", marginTop: "0.25rem" }}>
                {formattedDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                {lang === "mr" ? "वेळ" : "Time"}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {formattedTime}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                {lang === "mr" ? "स्थळ" : "Venue"}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {event.venue}, {event.district}
              </div>
            </div>

            {event.chiefGuests && (
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                  {t.events.chiefGuests}
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-gold-light)", marginTop: "0.25rem" }}>
                  {event.chiefGuests}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <h3 style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              marginBottom: "1rem",
              color: "var(--text-main)"
            }}>
              {lang === "mr" ? "कार्यक्रमाचे स्वरूप व माहिती" : "Event Schedule & Overview"}
            </h3>

            <div style={{
              fontSize: "1.05rem",
              color: "#334155",
              lineHeight: 1.9,
              whiteSpace: "pre-line"
            }}>
              {description}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
