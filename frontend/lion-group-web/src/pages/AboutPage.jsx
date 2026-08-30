import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { aboutService } from "../services/aboutService";
import { PageHeader } from "../components/common/PageHeader";
import { MemberCard } from "../components/members/MemberCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Target, Compass, BookOpen, Shield, Users, Award, ArrowRight } from "lucide-react";

export const AboutPage = () => {
  const { lang, t } = useLanguage();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aboutService.getAboutData();
      setAboutData(data);
    } catch (err) {
      console.error("Error loading about page data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAboutData} />;

  const mission = lang === "mr" ? aboutData?.missionMarathi : aboutData?.missionEnglish;
  const vision = lang === "mr" ? aboutData?.visionMarathi : aboutData?.visionEnglish;
  const history = lang === "mr" ? aboutData?.aboutHistoryMarathi : aboutData?.aboutHistoryEnglish;

  return (
    <div>
      {/* Header */}
      <PageHeader
        badge={t.nav.about}
        title={lang === "mr" ? "लायन ग्रुप महाराष्ट्र राज्य - परिचय व कार्य" : "About Lion Group Maharashtra Rajya"}
        subtitle={lang === "mr" ? "आमचे ध्येय, उद्दिष्टे आणि सामाजिक कार्याचा गौरवशाली प्रवास" : "Our mission, vision, history, and sacred journey of selfless public service."}
        breadcrumb={[{ label: t.nav.about }]}
      />

      {/* Mission & Vision Section */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem"
          }} className="mission-grid">
            {/* Mission Card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, #FFFFFF 100%)",
              border: "2px solid rgba(212, 175, 55, 0.35)",
              borderRadius: "var(--radius-xl)",
              padding: "3rem 2.5rem",
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, #F5C542 0%, #D4AF37 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                color: "#070D1E",
                boxShadow: "0 8px 20px rgba(212, 175, 55, 0.35)"
              }}>
                <Target size={34} />
              </div>

              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1rem"
              }}>
                {lang === "mr" ? "आमचे ध्येय (Mission)" : "Our Mission"}
              </h2>

              <p style={{
                fontSize: "1.05rem",
                color: "var(--text-muted)",
                lineHeight: 1.8
              }}>
                {mission}
              </p>
            </div>

            {/* Vision Card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(14, 26, 51, 0.04) 0%, #FFFFFF 100%)",
              border: "2px solid rgba(14, 26, 51, 0.15)",
              borderRadius: "var(--radius-xl)",
              padding: "3rem 2.5rem",
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, #0E1A33 0%, #16284D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                color: "var(--primary-gold)",
                boxShadow: "0 8px 20px rgba(14, 26, 51, 0.25)"
              }}>
                <Compass size={34} />
              </div>

              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1rem"
              }}>
                {lang === "mr" ? "आमची दूरदृष्टी (Vision)" : "Our Vision"}
              </h2>

              <p style={{
                fontSize: "1.05rem",
                color: "var(--text-muted)",
                lineHeight: 1.8
              }}>
                {vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Foundation Section */}
      <section className="section section-dark">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3.5rem",
            alignItems: "center"
          }} className="history-grid">
            <div>
              <div className="section-badge">
                📖 {lang === "mr" ? "संस्थेची पार्श्वभूमी" : "Our Journey & Heritage"}
              </div>
              <h2 className="section-title" style={{ color: "#FFFFFF" }}>
                {lang === "mr" ? "लायन ग्रुपचा इतिहास व वाटचाल" : "The Genesis & Growth of Lion Group"}
              </h2>
              <p style={{
                fontSize: "1.1rem",
                color: "var(--text-light-muted)",
                lineHeight: 1.85,
                marginBottom: "1.5rem"
              }}>
                {history}
              </p>
              <p style={{
                fontSize: "1.05rem",
                color: "var(--text-light-muted)",
                lineHeight: 1.85
              }}>
                {lang === "mr"
                  ? "आजपर्यंत हजारो रक्तदाते, पर्यावरण संवर्धन मोहिमा, आणि आपत्तीग्रस्तांना दिलेला मदतीचा हात यामुळे लायन ग्रुप महाराष्ट्रातील घराघरात विश्वासाचे नाव बनले आहे."
                  : "Through thousands of blood units organized, green corridors planted, and relentless disaster relief, Lion Group has earned deep trust and community goodwill across Maharashtra."}
              </p>
            </div>

            {/* Core Values Box */}
            <div style={{
              background: "rgba(14, 26, 51, 0.9)",
              border: "1.5px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              boxShadow: "var(--shadow-xl)"
            }}>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--primary-gold)",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Shield size={24} />
                <span>{lang === "mr" ? "आमची मूलभूत मूल्ये" : "Our Core Values"}</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  {
                    title: lang === "mr" ? "१. निस्वार्थ जनसेवा" : "1. Selfless Public Service",
                    desc: lang === "mr" ? "कोणत्याही स्वार्थाशिवाय समाजातील शेवटच्या घटकापर्यंत मदत पोहोचवणे." : "Providing aid to the most vulnerable without expectation."
                  },
                  {
                    title: lang === "mr" ? "२. एकात्मता व बंधुभाव" : "2. Unity & Brotherhood",
                    desc: lang === "mr" ? "जात, धर्म, पंथ या पलीकडे जाऊन मानवकल्याण हाच एकमेव धर्म मानणे." : "Fostering communal harmony and brotherhood across society."
                  },
                  {
                    title: lang === "mr" ? "३. युवा नेतृत्व विकास" : "3. Youth Leadership Development",
                    desc: lang === "mr" ? "महाराष्ट्रातील तरुणांना विधायक आणि राष्ट्रउभारणीच्या कार्यात दिशा देणे." : "Inspiring youth to channel their energies into nation-building."
                  },
                  {
                    title: lang === "mr" ? "४. पारदर्शकता आणि निष्ठा" : "4. Integrity & Transparency",
                    desc: lang === "mr" ? "संस्थेचे प्रत्येक कार्य प्रामाणिकपणे आणि पारदर्शक पद्धतीने चालवणे." : "Upholding the highest ethical standards in every social drive."
                  }
                ].map((val, idx) => (
                  <div key={idx} style={{
                    padding: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "var(--radius-md)",
                    borderLeft: "3px solid var(--primary-gold)"
                  }}>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: "0.25rem" }}>
                      {val.title}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light-muted)" }}>
                      {val.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .mission-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .history-grid {
              grid-template-columns: 1.1fr 0.9fr !important;
            }
          }
        `}</style>
      </section>

      {/* Executive Leadership Preview */}
      {aboutData?.coreLeadership && aboutData.coreLeadership.length > 0 && (
        <section className="section section-cream">
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
                  🦁 {t.leadership.badge}
                </div>
                <h2 className="section-title">
                  {t.leadership.coreLeadership}
                </h2>
                <p className="section-subtitle">
                  {t.leadership.subtitle}
                </p>
              </div>

              <Link to="/leadership" className="btn btn-gold">
                <span>{lang === "mr" ? "सर्व पदाधिकारी पहा" : "View All Leaders"}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-4">
              {aboutData.coreLeadership.slice(0, 4).map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
