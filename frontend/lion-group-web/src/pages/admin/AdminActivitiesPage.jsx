import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { activityService } from "../../services/activityService";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { MAHARASHTRA_DISTRICTS } from "../../utils/constants";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  X,
  Save,
  Loader2
} from "lucide-react";

export const AdminActivitiesPage = () => {
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    titleEnglish: "",
    titleMarathi: "",
    category: "BloodDonation",
    summaryEnglish: "",
    summaryMarathi: "",
    descriptionEnglish: "",
    descriptionMarathi: "",
    location: "",
    district: "Pune",
    activityDate: new Date().toISOString().slice(0, 10),
    bannerImageUrl: "",
    beneficiariesCount: 100,
    volunteersCount: 20,
    isFeatured: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getActivities();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleOpenAddModal();
    }
  }, [searchParams]);

  const handleOpenAddModal = () => {
    setEditingActivity(null);
    setFormData(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (act) => {
    setEditingActivity(act);
    setFormData({
      titleEnglish: act.titleEnglish || "",
      titleMarathi: act.titleMarathi || "",
      category: act.category || "BloodDonation",
      summaryEnglish: act.summaryEnglish || "",
      summaryMarathi: act.summaryMarathi || "",
      descriptionEnglish: act.descriptionEnglish || "",
      descriptionMarathi: act.descriptionMarathi || "",
      location: act.location || "",
      district: act.district || "Pune",
      activityDate: act.activityDate ? new Date(act.activityDate).toISOString().slice(0, 10) : "",
      bannerImageUrl: act.bannerImageUrl || "",
      beneficiariesCount: act.beneficiariesCount || 0,
      volunteersCount: act.volunteersCount || 0,
      isFeatured: Boolean(act.isFeatured)
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!formData.titleEnglish.trim() || !formData.titleMarathi.trim() || !formData.summaryEnglish.trim() || !formData.location.trim()) {
      setFormError("Titles, summary, and location are required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      const payload = {
        ...formData,
        activityDate: new Date(formData.activityDate).toISOString(),
        beneficiariesCount: Number(formData.beneficiariesCount) || 0,
        volunteersCount: Number(formData.volunteersCount) || 0
      };

      if (editingActivity) {
        await activityService.updateActivity(editingActivity.id, payload);
      } else {
        await activityService.createActivity(payload);
      }

      setIsModalOpen(false);
      await fetchActivities();
    } catch (err) {
      setFormError(err.message || "Failed to save activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!activityToDelete) return;
    try {
      setDeleting(true);
      await activityService.deleteActivity(activityToDelete.id);
      setDeleteModalOpen(false);
      setActivityToDelete(null);
      await fetchActivities();
    } catch (err) {
      alert("Failed to delete activity: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      (act.titleEnglish && act.titleEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.titleMarathi && act.titleMarathi.includes(searchTerm)) ||
      (act.location && act.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || act.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Social Activities Management
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
            Manage community service drives (Blood donation, Tree plantation, Medical camps, Food relief).
          </p>
        </div>

        <button type="button" className="btn btn-gold" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Social Activity</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="admin-card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search activity by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        <select
          className="input-field"
          style={{ width: "auto", minWidth: "200px" }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories (सर्व उपक्रम)</option>
          <option value="BloodDonation">Blood Donation (रक्तदान)</option>
          <option value="TreePlantation">Tree Plantation (वृक्षारोपण)</option>
          <option value="HealthCamp">Health Camp (आरोग्य शिबिर)</option>
          <option value="FoodDistribution">Food Relief (अन्नदान)</option>
          <option value="Education">Education (शिक्षण)</option>
          <option value="CleanlinessDrive">Cleanliness Drive (स्वच्छता मोहीम)</option>
          <option value="WomenEmpowerment">Women Empowerment (महिला सबलीकरण)</option>
          <option value="CulturalCommunity">Cultural & Community Activities (सांस्कृतिक व सामुदायिक उपक्रम)</option>
          <option value="YouthDevelopment">Youth Development (युवा विकास)</option>
        </select>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <LoadingSpinner message="Loading Activities..." />
      ) : filteredActivities.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <p style={{ color: "var(--text-light-muted)", marginBottom: "1.25rem", fontSize: "1rem" }}>No activities found.</p>
          <button type="button" className="btn btn-outline-gold" onClick={handleOpenAddModal}>
            Add First Activity
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="admin-card"
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {/* Banner Image */}
              <div style={{ height: "160px", backgroundColor: "#070D1E", position: "relative", overflow: "hidden" }}>
                {act.bannerImageUrl ? (
                  <img src={act.bannerImageUrl} alt={act.titleEnglish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    🩸
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  top: "0.75rem",
                  left: "0.75rem",
                  backgroundColor: "rgba(7, 13, 30, 0.85)",
                  color: "var(--primary-gold)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {act.category}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                    {act.titleEnglish}
                  </h3>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--primary-gold)", fontFamily: "var(--font-marathi)", marginBottom: "0.75rem" }}>
                    {act.titleMarathi}
                  </h4>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-light-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>
                    {act.summaryEnglish}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", fontSize: "0.825rem", color: "var(--text-light-muted)", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Calendar size={14} color="var(--primary-gold)" />
                      <span>{new Date(act.activityDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <MapPin size={14} color="var(--primary-gold)" />
                      <span>{act.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Users size={14} color="#10B981" />
                      <span>{act.beneficiariesCount} Beneficiaries</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: "0.85rem" }}>
                  <button
                    type="button"
                    className="btn btn-outline-gold"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}
                    onClick={() => handleOpenEditModal(act)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem", color: "#EF4444" }}
                    onClick={() => {
                      setActivityToDelete(act);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(3, 7, 18, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1.25rem"
        }}>
          <div style={{
            backgroundColor: "#0B1528",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "16px",
            maxWidth: "680px",
            width: "100%",
            maxHeight: "92vh",
            overflowY: "auto",
            padding: "2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            color: "#F8FAFC"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-heading)" }}>
                {editingActivity ? "Edit Social Activity" : "Create Social Activity"}
              </h3>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "0.4rem", color: "var(--text-light-muted)" }}
              >
                <X size={22} />
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#FCA5A5", padding: "0.85rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveActivity}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Activity Title (English) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Mega Blood Donation Camp 2026"
                    value={formData.titleEnglish}
                    onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">उपक्रमाचे नाव (मराठी) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="उदा. भव्य रक्तदान महाशिबिर २०२६"
                    value={formData.titleMarathi}
                    onChange={(e) => setFormData({ ...formData, titleMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Category & District */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Category (प्रकार) *</label>
                  <select
                    className="input-field"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="BloodDonation">Blood Donation (रक्तदान शिबिर)</option>
                    <option value="TreePlantation">Tree Plantation (वृक्षारोपण)</option>
                    <option value="HealthCamp">Health Camp (आरोग्य तपासणी)</option>
                    <option value="FoodDistribution">Food Relief (अन्नदान मोहीम)</option>
                    <option value="Education">Education (शिक्षण)</option>
                    <option value="CleanlinessDrive">Cleanliness Drive (स्वच्छता मोहीम)</option>
                    <option value="WomenEmpowerment">Women Empowerment (महिला सबलीकरण)</option>
                    <option value="CulturalCommunity">Cultural & Community Activities (सांस्कृतिक व सामुदायिक उपक्रम)</option>
                    <option value="YouthDevelopment">Youth Development (युवा विकास)</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">District (जिल्हा) *</label>
                  <select
                    className="input-field"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Date */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Specific Location (ठिकाण) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Balewadi Complex, Pune"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Activity Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={formData.activityDate}
                    onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Impact Counts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Beneficiaries (लाभार्थी संख्या)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.beneficiariesCount}
                    onChange={(e) => setFormData({ ...formData, beneficiariesCount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Volunteers (स्वयंसेवक संख्या)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.volunteersCount}
                    onChange={(e) => setFormData({ ...formData, volunteersCount: e.target.value })}
                  />
                </div>
              </div>

              {/* Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Short Summary (English) *</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    required
                    placeholder="Brief 1-2 line highlight..."
                    value={formData.summaryEnglish}
                    onChange={(e) => setFormData({ ...formData, summaryEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">थोडक्यात माहिती (मराठी) *</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    required
                    placeholder="उपक्रमाचा थोडक्यात गोषवारा..."
                    value={formData.summaryMarathi}
                    onChange={(e) => setFormData({ ...formData, summaryMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Full Description (English)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Comprehensive activity narrative..."
                    value={formData.descriptionEnglish}
                    onChange={(e) => setFormData({ ...formData, descriptionEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">सविस्तर माहिती (मराठी)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="उपक्रमाची सविस्तर माहिती..."
                    value={formData.descriptionMarathi}
                    onChange={(e) => setFormData({ ...formData, descriptionMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Banner Photo */}
              <ImageUploadField
                label="Activity Banner Image"
                value={formData.bannerImageUrl}
                onChange={(url) => setFormData({ ...formData, bannerImageUrl: url })}
                placeholder="/uploads/blood_camp.jpg or upload directly"
              />

              {/* Featured Checkbox */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem", color: "#FFFFFF" }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Show in Homepage Featured Drives (मुख्यपृष्ठावर दर्शवा)</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: "0.7rem 1.8rem" }} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingActivity ? "Update Activity" : "Save Activity"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Social Activity"
        message={`Are you sure you want to remove the activity "${activityToDelete?.titleEnglish}"?`}
        onConfirm={handleDeleteActivity}
        onCancel={() => {
          setDeleteModalOpen(false);
          setActivityToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};
