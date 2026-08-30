import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { Calendar, MapPin, Award, Clock, ArrowRight } from "lucide-react";

export const EventCard = ({ event }) => {
  const { lang, t } = useLanguage();

  const title = lang === "mr" ? (event.titleMarathi || event.titleEnglish) : event.titleEnglish;
  const description = lang === "mr" ? (event.descriptionMarathi || event.descriptionEnglish) : event.descriptionEnglish;

  const eventDate = new Date(event.startDateTime);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { month: "short" });
  const year = eventDate.getFullYear();
  const time = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isUpcoming = event.status === "Upcoming" || new Date(event.startDateTime) >= new Date();

  return (
    <div className="card-white" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Banner / Poster */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden", backgroundColor: "#070D1E" }}>
        <img
          src={event.bannerImageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        
        {/* Date Ribbon Badge */}
        <div style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          backgroundColor: "#070D1E",
          border: "2px solid var(--primary-gold)",
          borderRadius: "var(--radius-md)",
          padding: "0.4rem 0.75rem",
          textAlign: "center",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--primary-gold)", lineHeight: 1 }}>
            {day}
          </div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
            {month}
          </div>
        </div>

        {/* Status Tag */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          {isUpcoming ? (
            <span className="badge badge-tree" style={{ backgroundColor: "#10B981", color: "#FFFFFF", border: "none" }}>
              ● {t.events.statusUpcoming}
            </span>
          ) : (
            <span className="badge" style={{ backgroundColor: "#64748B", color: "#FFFFFF", border: "none" }}>
              ✓ {t.events.statusCompleted}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
          color: "var(--text-main)",
          marginBottom: "0.75rem",
          lineHeight: 1.35
        }}>
          {title}
        </h3>

        {/* Venue & Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
            <MapPin size={15} color="var(--primary-gold-dark)" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
            <span>{event.venue}, {event.district}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Clock size={15} color="var(--primary-gold-dark)" style={{ flexShrink: 0 }} />
            <span>{time} ({year})</span>
          </div>
        </div>

        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
          flex: 1
        }}>
          {description}
        </p>

        {/* Chief Guests & Action */}
        <div style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {event.chiefGuests && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <span style={{ fontWeight: 600 }}>{t.events.chiefGuests}</span> {event.chiefGuests}
            </div>
          )}

          <Link
            to={`/events/${event.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--primary-gold-dark)",
              textDecoration: "none",
              marginLeft: "auto"
            }}
          >
            <span>{t.common.viewDetails}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
