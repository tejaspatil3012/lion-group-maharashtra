import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { memberService } from "../../services/memberService";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { MAHARASHTRA_DISTRICTS } from "../../utils/constants";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  X,
  Save,
  Loader2
} from "lucide-react";

export const AdminMembersPage = () => {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const initialForm = {
    fullNameEnglish: "",
    fullNameMarathi: "",
    designationId: "",
    mobileNumber: "",
    email: "",
    district: "Pune",
    taluka: "",
    villageOrCity: "",
    photoUrl: "",
    displayOrder: 1,
    isCoreLeader: false,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [membersData, designationsData] = await Promise.all([
        memberService.getAllMembers(),
        memberService.getDesignations()
      ]);
      setMembers(Array.isArray(membersData) ? membersData : []);
      setDesignations(Array.isArray(designationsData) ? designationsData : []);

      if (designationsData?.length > 0 && !formData.designationId) {
        setFormData((prev) => ({ ...prev, designationId: designationsData[0].id }));
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleOpenAddModal();
    }
  }, [searchParams, designations]);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      ...initialForm,
      designationId: designations[0]?.id || ""
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      fullNameEnglish: member.fullNameEnglish || "",
      fullNameMarathi: member.fullNameMarathi || "",
      designationId: member.designationId || (designations[0]?.id || ""),
      mobileNumber: member.mobileNumber || "",
      email: member.email || "",
      district: member.district || "Pune",
      taluka: member.taluka || "",
      villageOrCity: member.villageOrCity || "",
      photoUrl: member.photoUrl || "",
      displayOrder: member.displayOrder || 1,
      isCoreLeader: Boolean(member.isCoreLeader),
      isActive: member.isActive !== false
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!formData.fullNameEnglish.trim() || !formData.fullNameMarathi.trim()) {
      setFormError("Both English and Marathi names are required.");
      return;
    }
    if (!formData.designationId) {
      setFormError("Please select a designation.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      const payload = {
        ...formData,
        designationId: Number(formData.designationId),
        displayOrder: Number(formData.displayOrder) || 1
      };

      if (editingMember) {
        await memberService.updateMember(editingMember.id, payload);
      } else {
        await memberService.createMember(payload);
      }

      setIsModalOpen(false);
      await fetchMembers();
    } catch (err) {
      setFormError(err.message || "Failed to save member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      setDeleting(true);
      await memberService.deleteMember(memberToDelete.id);
      setDeleteModalOpen(false);
      setMemberToDelete(null);
      await fetchMembers();
    } catch (err) {
      alert("Failed to delete member: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      (m.fullNameEnglish && m.fullNameEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.fullNameMarathi && m.fullNameMarathi.includes(searchTerm)) ||
      (m.mobileNumber && m.mobileNumber.includes(searchTerm));
    const matchesDistrict = !districtFilter || m.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Members & Leadership Management
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
            Add, update, or remove committee members, designations, and upload photos.
          </p>
        </div>

        <button type="button" className="btn btn-gold" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="admin-card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search member by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        <select
          className="input-field"
          style={{ width: "auto", minWidth: "200px" }}
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts (सर्व जिल्हे)</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      {loading ? (
        <LoadingSpinner message="Loading Members..." />
      ) : filteredMembers.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <p style={{ color: "var(--text-light-muted)", marginBottom: "1.25rem", fontSize: "1rem" }}>No members found matching your search.</p>
          <button type="button" className="btn btn-outline-gold" onClick={handleOpenAddModal}>
            Add First Member
          </button>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(212, 175, 55, 0.08)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", color: "var(--primary-gold)" }}>
                  <th style={{ padding: "1rem 1.25rem" }}>Photo</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Name (English / मराठी)</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Designation</th>
                  <th style={{ padding: "1rem 1.25rem" }}>District</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Contact</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Role</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: index !== filteredMembers.length - 1 ? "1px solid rgba(212, 175, 55, 0.12)" : "none",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {/* Photo */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#070D1E", border: "1.5px solid rgba(212, 175, 55, 0.3)" }}>
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.fullNameEnglish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🦁</div>
                        )}
                      </div>
                    </td>

                    {/* Names */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{member.fullNameEnglish}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--primary-gold)", fontFamily: "var(--font-marathi)" }}>{member.fullNameMarathi}</div>
                    </td>

                    {/* Designation */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <span className="badge badge-gold">
                        {member.designationEnglish}
                      </span>
                    </td>

                    {/* District */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-light-muted)" }}>
                      {member.district} {member.taluka ? `(${member.taluka})` : ""}
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "0.85rem 1.25rem", fontSize: "0.85rem" }}>
                      {member.mobileNumber && <div style={{ color: "#FFFFFF", fontWeight: 500 }}>{member.mobileNumber}</div>}
                      {member.email && <div style={{ color: "var(--text-light-muted)", fontSize: "0.8rem" }}>{member.email}</div>}
                    </td>

                    {/* Role */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      {member.isCoreLeader ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "#10B981", fontWeight: 600 }}>
                          <UserCheck size={14} />
                          <span>Core Leader</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-light-muted)" }}>Member</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: "0.45rem", color: "var(--primary-gold)" }}
                          onClick={() => handleOpenEditModal(member)}
                          title="Edit Member"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: "0.45rem", color: "#EF4444" }}
                          onClick={() => {
                            setMemberToDelete(member);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
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
                {editingMember ? "Edit Member Details" : "Add New Member"}
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
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#FCA5A5",
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.5rem",
                fontSize: "0.875rem"
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMember}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Full Name (English) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Sanket Bhau Chaudhari"
                    value={formData.fullNameEnglish}
                    onChange={(e) => setFormData({ ...formData, fullNameEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">पूर्ण नाव (मराठी) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="उदा. संकेत भाऊ चौधरी"
                    value={formData.fullNameMarathi}
                    onChange={(e) => setFormData({ ...formData, fullNameMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Designation & District */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Designation (पद) *</label>
                  <select
                    className="input-field"
                    required
                    value={formData.designationId}
                    onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                  >
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEnglish} ({d.nameMarathi})
                      </option>
                    ))}
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

              {/* Contact Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Mobile Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="+91 98XXX XXXXX"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Location details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Taluka (तालुका)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Haveli / Yawal"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Village / City (गाव / शहर)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Kingaon / Pune"
                    value={formData.villageOrCity}
                    onChange={(e) => setFormData({ ...formData, villageOrCity: e.target.value })}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <ImageUploadField
                label="Member Photo (फोटो)"
                value={formData.photoUrl}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                placeholder="/uploads/photo.jpg or upload directly"
              />

              {/* Checkboxes & Order */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.75rem"
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem", color: "#FFFFFF" }}>
                  <input
                    type="checkbox"
                    checked={formData.isCoreLeader}
                    onChange={(e) => setFormData({ ...formData, isCoreLeader: e.target.checked })}
                  />
                  <span>Show on Leadership Page (राज्य कार्यकारिणी)</span>
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-light-muted)" }}>Display Order:</label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ width: "85px", padding: "0.4rem 0.6rem" }}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ padding: "0.7rem 1.8rem" }}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingMember ? "Update Member" : "Save Member"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Member"
        message={`Are you sure you want to remove ${memberToDelete?.fullNameEnglish} (${memberToDelete?.fullNameMarathi}) from the members directory?`}
        onConfirm={handleDeleteMember}
        onCancel={() => {
          setDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};
