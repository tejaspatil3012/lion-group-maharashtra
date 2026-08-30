import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { eventService } from "../services/eventService";
import { PageHeader } from "../components/common/PageHeader";
import { EventCard } from "../components/events/EventCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

export const EventsPage = () => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents({ status: activeTab });
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  return (
    <div>
      <PageHeader
        badge={t.events.badge}
        title={t.events.title}
        subtitle={t.events.subtitle}
        breadcrumb={[{ label: t.events.title }]}
      />

      <section className="section">
        <div className="container">
          {/* Tab Switcher */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "3rem"
          }}>
            <div style={{
              display: "inline-flex",
              backgroundColor: "#070D1E",
              padding: "0.4rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(212, 175, 55, 0.3)"
            }}>
              <button
                onClick={() => setActiveTab("Upcoming")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.75rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: activeTab === "Upcoming" ? "var(--primary-gold)" : "transparent",
                  color: activeTab === "Upcoming" ? "#070D1E" : "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Clock size={16} />
                <span>{t.events.upcomingTab}</span>
              </button>

              <button
                onClick={() => setActiveTab("Completed")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.75rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: activeTab === "Completed" ? "var(--primary-gold)" : "transparent",
                  color: activeTab === "Completed" ? "#070D1E" : "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{t.events.completedTab}</span>
              </button>
            </div>
          </div>

          {/* Events List */}
          {loading ? (
            <LoadingSpinner message={t.common.loading} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchEvents} />
          ) : events.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1rem",
              backgroundColor: "#F8FAFC",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed #CBD5E1"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📅</div>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {t.common.noData}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {lang === "mr" ? "सध्या या विभागात कोणतेही कार्यक्रम उपलब्ध नाहीत." : "No events available under this tab currently."}
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
