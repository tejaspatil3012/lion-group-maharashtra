import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { MapPin, Calendar, Users, Heart, ArrowRight } from "lucide-react";

export const ActivityCard = ({ activity }) => {
  const { lang, t } = useLanguage();

  const title = lang === "mr" ? (activity.titleMarathi || activity.titleEnglish) : activity.titleEnglish;
  const summary = lang === "mr" ? (activity.summaryMarathi || activity.summaryEnglish) : (activity.summaryEnglish || activity.summaryMarathi);
  
  const formattedDate = new Date(activity.activityDate).toLocaleDateString(
    lang === "mr" ? "mr-IN" : "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "BloodDonation":
        return <span className="badge badge-blood">🩸 {t.activities.categoryBlood}</span>;
      case "TreePlantation":
        return <span className="badge badge-tree">🌱 {t.activities.categoryTree}</span>;
      case "HealthCamp":
        return <span className="badge badge-health">🏥 {t.activities.categoryHealth}</span>;
      case "FoodDistribution":
        return <span className="badge badge-gold">🍲 {t.activities.categoryFood}</span>;
      default:
        return <span className="badge badge-gold">🦁 {activity.category}</span>;
    }
  };

  return (
    <div className="card-white" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Banner Image */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden", backgroundColor: "#0E1A33" }}>
        <img
          src={activity.bannerImageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div style={{ position: "absolute", top: "0.85rem", left: "0.85rem" }}>
          {getCategoryBadge(activity.category)}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Meta Line: Date & District */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.825rem",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Calendar size={14} color="var(--primary-gold-dark)" />
            <span>{formattedDate}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <MapPin size={14} color="var(--primary-gold-dark)" />
            <span>{activity.district}</span>
          </div>
        </div>

        {/* Title */}
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

        {/* Summary */}
        <p style={{
          fontSize: "0.925rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
          flex: 1
        }}>
          {summary}
        </p>

        {/* Impact Bar & Read More */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #F1F5F9",
          paddingTop: "1rem",
          marginTop: "auto"
        }}>
          {activity.beneficiariesCount > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>
              <Users size={15} color="var(--primary-gold-dark)" />
              <span>{activity.beneficiariesCount.toLocaleString()}+ {t.activities.beneficiariesBadge}</span>
            </div>
          ) : <div />}

          <Link
            to={`/activities/${activity.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--primary-gold-dark)",
              textDecoration: "none"
            }}
          >
            <span>{t.common.readMore}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
