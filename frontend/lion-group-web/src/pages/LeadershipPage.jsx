import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { memberService } from "../services/memberService";
import { aboutService } from "../services/aboutService";
import { PageHeader } from "../components/common/PageHeader";
import { MemberCard } from "../components/members/MemberCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Award, Quote, Shield } from "lucide-react";

export const LeadershipPage = () => {
  const { lang, t } = useLanguage();
  const [leadership, setLeadership] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeadershipData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [leaders, about] = await Promise.all([
        memberService.getLeadership(),
        aboutService.getAboutData()
      ]);
      setLeadership(leaders);
      setAboutData(about);
    } catch (err) {
      console.error("Error loading leadership data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadershipData();
  }, []);

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchLeadershipData} />;

  const presidentName = lang === "mr"
    ? (aboutData?.presidentNameMarathi || "श्री. चंद्रकांत (दादा) पाटील")
    : (aboutData?.presidentNameEnglish || "Shri. Chandrakant (Dada) Patil");

  const presidentMsg = lang === "mr"
    ? (aboutData?.presidentMessageMarathi || "")
    : (aboutData?.presidentMessageEnglish || "");

  return (
    <div>
      <PageHeader
        badge={t.leadership.badge}
        title={t.leadership.title}
        subtitle={t.leadership.subtitle}
        breadcrumb={[{ label: t.leadership.title }]}
      />

      {/* President's Message Address */}
      <section className="section section-cream" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div className="container">
          <div style={{
            background: "#FFFFFF",
            border: "2px solid rgba(212, 175, 55, 0.35)",
            borderRadius: "var(--radius-xl)",
            padding: "3.5rem 3rem",
            boxShadow: "var(--shadow-xl)"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "center"
            }} className="president-full-grid">
              {/* Portrait */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 1.5rem auto",
                  border: "4px solid var(--primary-gold)",
                  boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)"
                }}>
                  <img
                    src={aboutData?.presidentPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"}
                    alt={presidentName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginBottom: "0.25rem"
                }}>
                  {presidentName}
                </h3>

                <div style={{
                  display: "inline-block",
                  padding: "0.25rem 0.85rem",
                  backgroundColor: "rgba(212, 175, 55, 0.15)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--primary-gold-dark)",
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}>
                  {t.president.designation}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="section-badge">
                  📜 {lang === "mr" ? "अध्यक्षीय संदेश" : "President's Official Address"}
                </div>
                <h2 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginBottom: "1.25rem"
                }}>
                  {lang === "mr" ? "सामाजिक बांधिलकी आणि अखंड जनसेवा" : "Commitment to Service & Social Transformation"}
                </h2>

                <div style={{ position: "relative" }}>
                  <Quote size={32} color="rgba(212, 175, 55, 0.4)" style={{ position: "absolute", top: "-10px", left: "-15px" }} />
                  <p style={{
                    fontSize: "1.1rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.85,
                    position: "relative",
                    zIndex: 2,
                    paddingLeft: "1.5rem"
                  }}>
                    {presidentMsg}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 900px) {
            .president-full-grid {
              grid-template-columns: 0.7fr 1.3fr !important;
            }
          }
        `}</style>
      </section>

      {/* Core Leadership Committee Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              🦁 {t.leadership.coreLeadership}
            </div>
            <h2 className="section-title">
              {lang === "mr" ? "महाराष्ट्र राज्य मुख्य कार्यकारिणी" : "State Executive Committee"}
            </h2>
            <p className="section-subtitle">
              {lang === "mr"
                ? "लायन ग्रुप महाराष्ट्र राज्याच्या ध्येयधोरणांना दिशा देणारे सन्माननीय पदाधिकारी"
                : "Honorable leadership guiding the policies and statewide initiatives of Lion Group Maharashtra."}
            </p>
          </div>

          <div className="grid-3">
            {leadership.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
