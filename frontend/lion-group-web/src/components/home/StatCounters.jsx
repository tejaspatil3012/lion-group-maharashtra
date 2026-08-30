import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Users, Heart, TreePine, Smile } from "lucide-react";

export const StatCounters = ({ homeData }) => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Users size={28} color="#F59E0B" />,
      value: (homeData?.totalMembersCount || 2850).toLocaleString() + "+",
      label: t.stats.members,
      borderGlow: "rgba(245, 158, 11, 0.3)"
    },
    {
      icon: <Heart size={28} color="#EF4444" />,
      value: (homeData?.totalBloodUnitsDonated || 5420).toLocaleString() + "+",
      label: t.stats.bloodDonated,
      borderGlow: "rgba(239, 68, 68, 0.3)"
    },
    {
      icon: <TreePine size={28} color="#10B981" />,
      value: (homeData?.totalTreesPlanted || 18600).toLocaleString() + "+",
      label: t.stats.treesPlanted,
      borderGlow: "rgba(16, 185, 129, 0.3)"
    },
    {
      icon: <Smile size={28} color="#3B82F6" />,
      value: (homeData?.totalBeneficiariesServed || 62000).toLocaleString() + "+",
      label: t.stats.beneficiaries,
      borderGlow: "rgba(59, 130, 246, 0.3)"
    }
  ];

  return (
    <div style={{
      marginTop: "-3rem",
      position: "relative",
      zIndex: 10,
      marginBottom: "3rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem"
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: "linear-gradient(135deg, #0E1A33 0%, #132347 100%)",
                border: `1.5px solid ${stat.borderGlow}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem 1.25rem",
                textAlign: "center",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}>
                {stat.icon}
              </div>

              <div style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginBottom: "0.4rem"
              }}>
                {stat.value}
              </div>

              <div style={{
                fontSize: "0.925rem",
                fontWeight: 600,
                color: "var(--text-light-muted)"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
