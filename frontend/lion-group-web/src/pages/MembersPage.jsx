import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { memberService } from "../services/memberService";
import { PageHeader } from "../components/common/PageHeader";
import { MemberCard } from "../components/members/MemberCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { MAHARASHTRA_DISTRICTS } from "../utils/constants";
import { Search, Filter, RefreshCw, Users } from "lucide-react";

export const MembersPage = () => {
  const { lang, t } = useLanguage();
  const [members, setMembers] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [searchName, setSearchName] = useState("");

  const fetchMembersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [membersData, desigData] = await Promise.all([
        memberService.getAllMembers({
          district: selectedDistrict || undefined,
          designationId: selectedDesignation ? parseInt(selectedDesignation) : undefined
        }),
        memberService.getDesignations()
      ]);
      setMembers(membersData);
      setDesignations(desigData);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, [selectedDistrict, selectedDesignation]);

  const handleReset = () => {
    setSelectedDistrict("");
    setSelectedDesignation("");
    setSearchName("");
  };

  // Client-side search filtering by name
  const filteredMembers = members.filter((m) => {
    if (!searchName) return true;
    const s = searchName.toLowerCase();
    return (
      m.fullNameEnglish.toLowerCase().includes(s) ||
      m.fullNameMarathi.includes(searchName) ||
      m.district.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <PageHeader
        badge={t.members.badge}
        title={t.members.title}
        subtitle={t.members.subtitle}
        breadcrumb={[{ label: t.members.title }]}
      />

      <section className="section">
        <div className="container">
          {/* Filters Bar */}
          <div style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "2.5rem"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              alignItems: "center"
            }}>
              {/* Search by Name */}
              <div style={{ position: "relative" }}>
                <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "2.75rem" }}
                  placeholder={t.members.searchByName}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* District Filter */}
              <div>
                <select
                  className="form-control"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">{t.members.allDistricts}</option>
                  {MAHARASHTRA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div>
                <select
                  className="form-control"
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                >
                  <option value="">
                    {lang === "mr" ? "सर्व पदे / जबाबदाऱ्या" : "All Designations"}
                  </option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === "mr" ? d.NameMarathi || d.nameMarathi : d.NameEnglish || d.nameEnglish}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div>
                <button
                  onClick={handleReset}
                  className="btn btn-outline-gold"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    color: "var(--text-main)",
                    borderColor: "#CBD5E1"
                  }}
                >
                  <RefreshCw size={16} />
                  <span>{lang === "mr" ? "फिल्टर रीसेट" : "Reset Filters"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Members Count Status & Join CTA */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={18} color="var(--primary-gold-dark)" />
              <span>
                {lang === "mr"
                  ? `एकूण सदस्य: ${filteredMembers.length}`
                  : `Total Members Displayed: ${filteredMembers.length}`}
              </span>
            </div>

            <Link
              to="/be-a-member"
              className="btn btn-gold"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
            >
              <span>{lang === "mr" ? "+ सदस्य नोंदणी करा" : "+ Be A Member"}</span>
            </Link>
          </div>

          {/* Loading / Error / Grid */}
          {loading ? (
            <LoadingSpinner message={t.common.loading} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMembersData} />
          ) : filteredMembers.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1rem",
              backgroundColor: "#F8FAFC",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed #CBD5E1"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {t.common.noData}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {lang === "mr" ? "कृपया इतर फिल्टर निवडून पुन्हा शोधा." : "Try selecting a different district or clearing search filters."}
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
