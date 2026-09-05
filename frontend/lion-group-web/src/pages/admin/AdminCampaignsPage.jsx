import React, { useState, useEffect } from "react";
import { donationService } from "../../services/donationService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { getImageUrl } from "../../services/api";
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar,
  Sparkles,
  AlertCircle
} from "lucide-react";

export const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormData = {
    titleEnglish: "",
    titleMarathi: "",
    summaryEnglish: "",
    summaryMarathi: "",
    descriptionEnglish: "",
    descriptionMarathi: "",
    targetAmount: "",
    bannerImageUrl: "",
    endDate: "",
    isActive: true,
    isFeatured: false
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await donationService.getAllCampaigns();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      titleEnglish: c.titleEnglish,
      titleMarathi: c.titleMarathi,
      summaryEnglish: c.summaryEnglish,
      summaryMarathi: c.summaryMarathi,
      descriptionEnglish: c.descriptionEnglish,
      descriptionMarathi: c.descriptionMarathi,
      targetAmount: (c.targetAmount != null ? c.targetAmount : "").toString(),
      bannerImageUrl: c.bannerImageUrl || "",
      endDate: c.endDate ? c.endDate.split("T")[0] : "",
      isActive: c.isActive,
      isFeatured: c.isFeatured
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titleEnglish.trim() || !formData.titleMarathi.trim() || !formData.targetAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        titleEnglish: formData.titleEnglish.trim(),
        titleMarathi: formData.titleMarathi.trim(),
        summaryEnglish: formData.summaryEnglish.trim(),
        summaryMarathi: formData.summaryMarathi.trim(),
        descriptionEnglish: formData.descriptionEnglish.trim(),
        descriptionMarathi: formData.descriptionMarathi.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        bannerImageUrl: formData.bannerImageUrl,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured
      };

      if (editingId) {
        await donationService.updateCampaign(editingId, payload);
      } else {
        await donationService.createCampaign(payload);
      }

      setModalOpen(false);
      loadCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete campaign "${title}"?`)) {
      try {
        await donationService.deleteCampaign(id);
        setCampaigns(campaigns.filter((c) => c.id !== id));
      } catch (err) {
        alert("Failed to delete campaign.");
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-light)", margin: 0 }}>
            Donation Campaigns (निधी मोहीम व्यवस्थापन)
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Create and manage fundraising initiatives and charitable drives
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-gold"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={18} />
          Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <LoadingSpinner message="Loading Campaigns..." />
      ) : campaigns.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3rem" }}>
          <Target size={48} color="var(--primary-gold)" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ color: "var(--text-light)", marginBottom: "0.5rem" }}>No Campaigns Found</h3>
          <p style={{ color: "var(--text-light-muted)", marginBottom: "1.5rem" }}>
            Start by creating your first fundraising campaign for Lion Group.
          </p>
          <button type="button" onClick={handleOpenAdd} className="btn btn-outline-gold">
            Add First Campaign
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1.5rem"
        }}>
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="admin-card"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid var(--border-gold)"
              }}
            >
              {/* Campaign Image */}
              <div style={{ height: "180px", position: "relative", backgroundColor: "#070D1E" }}>
                <img
                  src={getImageUrl(camp.bannerImageUrl) || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"}
                  alt={camp.titleEnglish}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  display: "flex",
                  gap: "0.35rem"
                }}>
                  <span className={`badge ${camp.isActive ? "badge-tree" : "badge-blood"}`}>
                    {camp.isActive ? "Active" : "Inactive"}
                  </span>
                  {camp.isFeatured && (
                    <span className="badge badge-gold">
                      <Sparkles size={11} style={{ marginRight: "0.2rem" }} /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-light)", marginBottom: "0.25rem" }}>
                  {camp.titleEnglish}
                </h3>
                <h4 style={{ fontSize: "0.95rem", color: "var(--primary-gold)", marginBottom: "0.75rem" }}>
                  {camp.titleMarathi}
                </h4>

                {/* Progress */}
                <div style={{ marginBottom: "1.25rem", marginTop: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", marginBottom: "0.35rem" }}>
                    <span style={{ color: "var(--primary-gold)", fontWeight: 700 }}>
                      ₹{Number(camp.raisedAmount || 0).toLocaleString("en-IN")} raised
                    </span>
                    <span style={{ color: "var(--text-light-muted)" }}>
                      Target: ₹{Number(camp.targetAmount || 0).toLocaleString("en-IN")} ({camp.progressPercentage}%)
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, camp.progressPercentage)}%`, height: "100%", background: "var(--gradient-gold)" }} />
                  </div>
                </div>

                {/* Donors Count */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-light-muted)", marginBottom: "1.25rem" }}>
                  <Users size={14} />
                  <span>{camp.donorsCount} verified donors</span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(camp)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "0.45rem", fontSize: "0.825rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(camp.id, camp.titleEnglish)}
                    className="btn btn-danger"
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.825rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(5, 9, 20, 0.85)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          zIndex: 1000,
          overflowY: "auto"
        }}>
          <div style={{
            background: "#070D1E",
            border: "1px solid var(--border-gold)",
            borderRadius: "var(--radius-xl)",
            maxWidth: "640px",
            width: "100%",
            padding: "2rem",
            color: "#FFFFFF",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.5rem" }}>
              {editingId ? "Edit Campaign" : "Create New Campaign (नवीन निधी मोहीम)"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">Title (English) *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Ambulance Medical Fund"
                    value={formData.titleEnglish}
                    onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Title (Marathi) *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="उदा. रुग्णवाहिका व आरोग्य सेवा निधी"
                    value={formData.titleMarathi}
                    onChange={(e) => setFormData({ ...formData, titleMarathi: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">Target Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    className="input-field"
                    placeholder="e.g. 500000"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">End Date (Optional)</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <ImageUploadField
                  label="Banner Poster Image"
                  value={formData.bannerImageUrl}
                  onChange={(url) => setFormData({ ...formData, bannerImageUrl: url })}
                  placeholder="Upload campaign banner or paste Supabase URL"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">Short Summary (English)</label>
                  <textarea
                    rows={2}
                    className="input-field"
                    value={formData.summaryEnglish}
                    onChange={(e) => setFormData({ ...formData, summaryEnglish: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Short Summary (Marathi)</label>
                  <textarea
                    rows={2}
                    className="input-field"
                    value={formData.summaryMarathi}
                    onChange={(e) => setFormData({ ...formData, summaryMarathi: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Detailed Description (English) *</label>
                  <textarea
                    rows={4}
                    required
                    className="input-field"
                    value={formData.descriptionEnglish}
                    onChange={(e) => setFormData({ ...formData, descriptionEnglish: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Detailed Description (Marathi) *</label>
                  <textarea
                    rows={4}
                    required
                    className="input-field"
                    value={formData.descriptionMarathi}
                    onChange={(e) => setFormData({ ...formData, descriptionMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: "2rem", marginBottom: "1.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active Campaign (Visible on Website)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured Campaign</span>
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ flex: 2 }}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : (editingId ? "Update Campaign" : "Publish Campaign")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
