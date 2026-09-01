import React, { useEffect, useState } from "react";
import { aboutService } from "../../services/aboutService";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  Settings,
  Save,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Heart,
  TrendingUp,
  User,
  Shield,
  Loader2
} from "lucide-react";

export const AdminSettingsPage = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAboutData();
        if (data) {
          setFormData({
            orgNameEnglish: data.orgNameEnglish || "LION GROUP MAHARASHTRA RAJYA",
            orgNameMarathi: data.orgNameMarathi || "लायन ग्रुप महाराष्ट्र राज्य",
            taglineEnglish: data.taglineEnglish || "",
            taglineMarathi: data.taglineMarathi || "",
            missionEnglish: data.missionEnglish || "",
            missionMarathi: data.missionMarathi || "",
            visionEnglish: data.visionEnglish || "",
            visionMarathi: data.visionMarathi || "",
            aboutHistoryEnglish: data.aboutHistoryEnglish || "",
            aboutHistoryMarathi: data.aboutHistoryMarathi || "",
            presidentNameEnglish: data.presidentNameEnglish || "Pailwan Tejas Bhau Chaudhari(KING)",
            presidentNameMarathi: data.presidentNameMarathi || "पैलवान तेजस भाऊ चौधरी(किंग)",
            presidentPhotoUrl: data.presidentPhotoUrl || "/uploads/king.jpeg",
            presidentMessageEnglish: data.presidentMessageEnglish || "",
            presidentMessageMarathi: data.presidentMessageMarathi || "",
            headOfficeAddressEnglish: data.headOfficeAddressEnglish ?? "Lion Group Central Office, Kingaon, Tal. Yawal, Dist. Jalgaon",
            headOfficeAddressMarathi: data.headOfficeAddressMarathi ?? "लायन ग्रुप राज्य मुख्य कार्यालय, चौधरी वाडा, किनगाव, ता. यावल, जि. जळगाव",
            primaryPhone: data.primaryPhone ?? "+91 98220 12345",
            emergencyBloodHelpline: data.emergencyBloodHelpline ?? "+91 98220 99999",
            primaryEmail: data.primaryEmail ?? "contact@liongroupmaharashtra.org",
            totalMembersCount: data.totalMembersCount ?? 2850,
            totalBloodUnitsDonated: data.totalBloodUnitsDonated ?? 5420,
            totalTreesPlanted: data.totalTreesPlanted ?? 18600,
            totalBeneficiariesServed: data.totalBeneficiariesServed ?? 62000
          });
        }
      } catch (err) {
        console.error("Error fetching about info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const payload = {
        ...formData,
        totalMembersCount: Number(formData.totalMembersCount) || 0,
        totalBloodUnitsDonated: Number(formData.totalBloodUnitsDonated) || 0,
        totalTreesPlanted: Number(formData.totalTreesPlanted) || 0,
        totalBeneficiariesServed: Number(formData.totalBeneficiariesServed) || 0
      };

      await aboutService.updateAboutData(payload);
      setSuccessMessage("Organization profile, President address, and impact statistics updated successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(err.message || "Failed to update organization settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <LoadingSpinner message="Loading Organization Settings..." />;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
          Organization Profile & System Settings
        </h1>
        <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
          Update President address, blood helpline numbers, headquarters address, and live impact counters.
        </p>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          color: "#6EE7B7",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.95rem"
        }}>
          <CheckCircle size={20} color="#10B981" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          color: "#FCA5A5",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1.75rem",
          fontSize: "0.95rem"
        }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Section 1: Live Impact Counters */}
        <div className="admin-card" style={{ marginBottom: "1.75rem" }}>
          <div className="admin-section-title">
            <TrendingUp size={20} />
            <span>Live Impact Metrics (मुख्यपृष्ठ आकडेवारी)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <div>
              <label className="admin-label">Total Members (सक्रिय कार्यकर्ते)</label>
              <input
                type="number"
                className="input-field"
                value={formData.totalMembersCount}
                onChange={(e) => setFormData({ ...formData, totalMembersCount: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Blood Units (रक्त बाटल्या संकलन)</label>
              <input
                type="number"
                className="input-field"
                value={formData.totalBloodUnitsDonated}
                onChange={(e) => setFormData({ ...formData, totalBloodUnitsDonated: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Trees Planted (झाडे लागवड)</label>
              <input
                type="number"
                className="input-field"
                value={formData.totalTreesPlanted}
                onChange={(e) => setFormData({ ...formData, totalTreesPlanted: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Beneficiaries (एकूण लाभार्थी)</label>
              <input
                type="number"
                className="input-field"
                value={formData.totalBeneficiariesServed}
                onChange={(e) => setFormData({ ...formData, totalBeneficiariesServed: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: President Profile & Message */}
        <div className="admin-card" style={{ marginBottom: "1.75rem" }}>
          <div className="admin-section-title">
            <User size={20} />
            <span>State President Spotlight (अध्यक्षीय मनोगत)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label className="admin-label">President Name (English)</label>
              <input
                type="text"
                className="input-field"
                value={formData.presidentNameEnglish}
                onChange={(e) => setFormData({ ...formData, presidentNameEnglish: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">अध्यक्षांचे नाव (मराठी)</label>
              <input
                type="text"
                className="input-field"
                value={formData.presidentNameMarathi}
                onChange={(e) => setFormData({ ...formData, presidentNameMarathi: e.target.value })}
              />
            </div>
          </div>

          <ImageUploadField
            label="President Portrait Photo (अध्यक्ष छायाचित्र)"
            value={formData.presidentPhotoUrl}
            onChange={(url) => setFormData({ ...formData, presidentPhotoUrl: url })}
            placeholder="/uploads/president.jpg or upload"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="admin-label">President's Message (English)</label>
              <textarea
                className="input-field"
                rows={5}
                value={formData.presidentMessageEnglish}
                onChange={(e) => setFormData({ ...formData, presidentMessageEnglish: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">अध्यक्षीय मनोगत (मराठी)</label>
              <textarea
                className="input-field"
                rows={5}
                value={formData.presidentMessageMarathi}
                onChange={(e) => setFormData({ ...formData, presidentMessageMarathi: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Emergency Helplines */}
        <div className="admin-card" style={{ marginBottom: "1.75rem" }}>
          <div className="admin-section-title">
            <Phone size={20} />
            <span>Contact Details & 24x7 Emergency Helplines</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label className="admin-label">Primary Phone (संपर्क क्रमांक)</label>
              <input
                type="text"
                className="input-field"
                value={formData.primaryPhone}
                onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label" style={{ color: "#FCA5A5" }}>
                Emergency Blood Helpline (२४ तास रक्त हेल्पलाइन) *
              </label>
              <input
                type="text"
                className="input-field"
                style={{ borderColor: "rgba(239, 68, 68, 0.5) !important" }}
                value={formData.emergencyBloodHelpline}
                onChange={(e) => setFormData({ ...formData, emergencyBloodHelpline: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Official Email (ईमेल)</label>
              <input
                type="email"
                className="input-field"
                value={formData.primaryEmail}
                onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="admin-label">Head Office Address (English)</label>
              <textarea
                className="input-field"
                rows={2}
                value={formData.headOfficeAddressEnglish}
                onChange={(e) => setFormData({ ...formData, headOfficeAddressEnglish: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">कार्यालय पत्ता (मराठी)</label>
              <textarea
                className="input-field"
                rows={2}
                value={formData.headOfficeAddressMarathi}
                onChange={(e) => setFormData({ ...formData, headOfficeAddressMarathi: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Mission & Vision */}
        <div className="admin-card" style={{ marginBottom: "2rem" }}>
          <div className="admin-section-title">
            <Shield size={20} />
            <span>Mission, Vision & History (ध्येय व उद्दिष्टे)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label className="admin-label">Mission (English)</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.missionEnglish}
                onChange={(e) => setFormData({ ...formData, missionEnglish: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">ध्येय (मराठी)</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.missionMarathi}
                onChange={(e) => setFormData({ ...formData, missionMarathi: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="admin-label">Vision (English)</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.visionEnglish}
                onChange={(e) => setFormData({ ...formData, visionEnglish: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">उद्दिष्ट (मराठी)</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.visionMarathi}
                onChange={(e) => setFormData({ ...formData, visionMarathi: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-gold" style={{ padding: "0.85rem 2.5rem", fontSize: "1rem" }} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
