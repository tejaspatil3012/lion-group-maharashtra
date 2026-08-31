import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { memberService } from "../../services/memberService";
import { eventService } from "../../services/eventService";
import { activityService } from "../../services/activityService";
import { galleryService } from "../../services/galleryService";
import { contactService } from "../../services/contactService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  Users,
  Calendar,
  Activity,
  Image as ImageIcon,
  Mail,
  PlusCircle,
  ArrowRight
} from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    membersCount: 0,
    eventsCount: 0,
    activitiesCount: 0,
    albumsCount: 0,
    inquiriesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [members, events, activities, albums, inquiries] = await Promise.allSettled([
          memberService.getAllMembers(),
          eventService.getEvents(),
          activityService.getActivities(),
          galleryService.getAlbums(),
          contactService.getAllInquiries()
        ]);

        setStats({
          membersCount: members.status === "fulfilled" && Array.isArray(members.value) ? members.value.length : 0,
          eventsCount: events.status === "fulfilled" && Array.isArray(events.value) ? events.value.length : 0,
          activitiesCount: activities.status === "fulfilled" && Array.isArray(activities.value) ? activities.value.length : 0,
          albumsCount: albums.status === "fulfilled" && Array.isArray(albums.value) ? albums.value.length : 0,
          inquiriesCount: inquiries.status === "fulfilled" && Array.isArray(inquiries.value) ? inquiries.value.length : 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Dashboard Metrics..." />;

  const statCards = [
    { title: "Total Members", count: stats.membersCount, icon: Users, to: "/admin/members", color: "#D4AF37" },
    { title: "Social Activities", count: stats.activitiesCount, icon: Activity, to: "/admin/activities", color: "#3B82F6" },
    { title: "Conclaves & Events", count: stats.eventsCount, icon: Calendar, to: "/admin/events", color: "#10B981" },
    { title: "Photo Albums", count: stats.albumsCount, icon: ImageIcon, to: "/admin/gallery", color: "#8B5CF6" },
    { title: "Contact Inquiries", count: stats.inquiriesCount, icon: Mail, to: "/admin/inquiries", color: "#EC4899" }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
          Admin Management Dashboard
        </h1>
        <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
          Manage your live database records, members, events, activities, and organization details directly.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2.5rem"
      }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.to}
              className="admin-card"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1.5rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-light-muted)" }}>
                  {card.title}
                </span>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: `${card.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color
                }}>
                  <Icon size={20} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                  {card.count}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--primary-gold)", display: "flex", alignItems: "center", gap: "3px" }}>
                  <span>Manage</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card">
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary-gold)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlusCircle size={20} />
          <span>Quick Actions</span>
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}>
          <Link to="/admin/members?action=add" className="btn btn-gold" style={{ justifyContent: "center" }}>
            <Users size={16} />
            <span>Add New Member</span>
          </Link>
          <Link to="/admin/activities?action=add" className="btn btn-outline-gold" style={{ justifyContent: "center" }}>
            <Activity size={16} />
            <span>Add Social Activity</span>
          </Link>
          <Link to="/admin/events?action=add" className="btn btn-outline-gold" style={{ justifyContent: "center" }}>
            <Calendar size={16} />
            <span>Add New Event</span>
          </Link>
          <Link to="/admin/gallery?action=add" className="btn btn-outline-gold" style={{ justifyContent: "center" }}>
            <ImageIcon size={16} />
            <span>Create Photo Album</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
