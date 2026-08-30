import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { activityService } from "../services/activityService";
import { PageHeader } from "../components/common/PageHeader";
import { ActivityCard } from "../components/activities/ActivityCard";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { ACTIVITY_CATEGORIES, MAHARASHTRA_DISTRICTS } from "../utils/constants";
import { Search, Filter, RefreshCw } from "lucide-react";

export const ActivitiesPage = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getActivities({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        district: selectedDistrict || undefined,
        search: searchQuery || undefined
      });
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory, selectedDistrict]);

  const handleCategoryClick = (catKey) => {
    setSelectedCategory(catKey);
    setSearchParams(catKey !== "all" ? { category: catKey } : {});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchActivities();
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedDistrict("");
    setSearchQuery("");
    setSearchParams({});
  };

  return (
    <div>
      <PageHeader
        badge={t.activities.badge}
        title={t.activities.title}
        subtitle={t.activities.subtitle}
        breadcrumb={[{ label: t.activities.title }]}
      />

      <section className="section">
        <div className="container">
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}>
            {ACTIVITY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.key.toLowerCase();
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    border: isActive ? "1.5px solid var(--primary-gold)" : "1.5px solid #E2E8F0",
                    backgroundColor: isActive ? "#070D1E" : "#FFFFFF",
                    color: isActive ? "var(--primary-gold)" : "var(--text-main)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.925rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "var(--shadow-md)" : "none"
                  }}
                >
                  {lang === "mr" ? cat.labelMr : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search & District Filter */}
          <div style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "2.5rem"
          }}>
            <form onSubmit={handleSearchSubmit} style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              alignItems: "center"
            }}>
              <div style={{ position: "relative" }}>
                <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "2.75rem" }}
                  placeholder={t.activities.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <select
                  className="form-control"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">{t.activities.filterByDistrict}</option>
                  {MAHARASHTRA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="btn btn-gold" style={{ flex: 1, padding: "0.75rem" }}>
                  <Search size={16} />
                  <span>{lang === "mr" ? "शोधा" : "Search"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-gold"
                  style={{ padding: "0.75rem 1rem", borderColor: "#CBD5E1", color: "var(--text-main)" }}
                  title="Reset"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Activities Grid */}
          {loading ? (
            <LoadingSpinner message={t.common.loading} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchActivities} />
          ) : activities.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1rem",
              backgroundColor: "#F8FAFC",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed #CBD5E1"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {t.common.noData}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {lang === "mr" ? "या श्रेणीमध्ये सध्या कोणतेही उपक्रम सापडले नाहीत." : "No activities found in this category or district."}
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
