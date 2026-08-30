import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { activityService } from "../services/activityService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Calendar, MapPin, Users, Heart, ArrowLeft, Share2 } from "lucide-react";

export const ActivityDetailPage = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getActivityById(id);
      setActivity(data);
    } catch (err) {
      console.error("Error loading activity details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchActivity} />;
  if (!activity) return <ErrorMessage message="Activity not found" />;

  const title = lang === "mr" ? (activity.titleMarathi || activity.titleEnglish) : activity.titleEnglish;
  const description = lang === "mr" ? (activity.descriptionMarathi || activity.descriptionEnglish) : activity.descriptionEnglish;
  const summary = lang === "mr" ? (activity.summaryMarathi || activity.summaryEnglish) : activity.summaryEnglish;

  const formattedDate = new Date(activity.activityDate).toLocaleDateString(
    lang === "mr" ? "mr-IN" : "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div>
      <PageHeader
        badge={activity.category}
        title={title}
        subtitle={`${formattedDate} • ${activity.location}, ${activity.district}`}
        breadcrumb={[
          { label: t.nav.activities, link: "/activities" },
          { label: title }
        ]}
      />

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          {/* Back Button */}
          <Link
            to="/activities"
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
              src={activity.bannerImageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Metrics Strip */}
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
                {lang === "mr" ? "तारीख व वेळ" : "Date"}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-gold)", marginTop: "0.25rem" }}>
                {formattedDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                {lang === "mr" ? "स्थान व जिल्हा" : "Location"}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {activity.location}, {activity.district}
              </div>
            </div>

            {activity.beneficiariesCount > 0 && (
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                  {t.activities.beneficiariesBadge}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#10B981", marginTop: "0.25rem" }}>
                  {activity.beneficiariesCount.toLocaleString()}+ {lang === "mr" ? "नागरिक" : "People"}
                </div>
              </div>
            )}

            {activity.volunteersCount > 0 && (
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-light-muted)", textTransform: "uppercase" }}>
                  {t.activities.volunteersBadge}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#3B82F6", marginTop: "0.25rem" }}>
                  {activity.volunteersCount.toLocaleString()}+ {lang === "mr" ? "कार्यकर्ते" : "Volunteers"}
                </div>
              </div>
            )}
          </div>

          {/* Narrative Story */}
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            {summary && (
              <div style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--text-main)",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid #E2E8F0"
              }}>
                {summary}
              </div>
            )}

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
