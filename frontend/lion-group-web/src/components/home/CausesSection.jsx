import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { Heart, TreePine, Stethoscope, Utensils, ArrowRight } from "lucide-react";

export const CausesSection = () => {
  const { t } = useLanguage();

  const causes = [
    {
      icon: <Heart size={32} color="#EF4444" fill="#EF4444" />,
      title: t.causes.blood.title,
      desc: t.causes.blood.desc,
      badge: "🩸 " + t.causes.blood.title,
      badgeClass: "badge-blood",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255, 255, 255, 1) 100%)",
      category: "BloodDonation"
    },
    {
      icon: <TreePine size={32} color="#10B981" />,
      title: t.causes.tree.title,
      desc: t.causes.tree.desc,
      badge: "🌱 " + t.causes.tree.title,
      badgeClass: "badge-tree",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 1) 100%)",
      category: "TreePlantation"
    },
    {
      icon: <Stethoscope size={32} color="#3B82F6" />,
      title: t.causes.health.title,
      desc: t.causes.health.desc,
      badge: "🏥 " + t.causes.health.title,
      badgeClass: "badge-health",
      bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255, 255, 255, 1) 100%)",
      category: "HealthCamp"
    },
    {
      icon: <Utensils size={32} color="#EA580C" />,
      title: t.causes.food.title,
      desc: t.causes.food.desc,
      badge: "🍲 " + t.causes.food.title,
      badgeClass: "badge-gold",
      bgGradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(255, 255, 255, 1) 100%)",
      category: "FoodDistribution"
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            🌟 {t.causes.badge}
          </div>
          <h2 className="section-title">
            {t.causes.title}
          </h2>
          <p className="section-subtitle">
            {t.causes.subtitle}
          </p>
        </div>

        <div className="grid-4">
          {causes.map((cause, idx) => (
            <div
              key={idx}
              className="card-white"
              style={{
                background: cause.bgGradient,
                padding: "2rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem"
                }}>
                  {cause.icon}
                </div>

                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-main)",
                  marginBottom: "0.75rem",
                  lineHeight: 1.3
                }}>
                  {cause.title}
                </h3>

                <p style={{
                  fontSize: "0.925rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  marginBottom: "1.5rem"
                }}>
                  {cause.desc}
                </p>
              </div>

              <Link
                to={`/activities?category=${cause.category}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--primary-gold-dark)",
                  textDecoration: "none"
                }}
              >
                <span>{t.common.viewDetails}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
