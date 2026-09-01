import React, { useState, useEffect } from "react";
import { membershipService } from "../../services/membershipService";
import { memberService } from "../../services/memberService";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  MessageSquare,
  Shield,
  Loader2,
  Trash2,
  Filter,
  UserPlus
} from "lucide-react";

export const AdminMembershipRequestsPage = () => {
  const [applications, setApplications] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Approval Modal State
  const [approvingApp, setApprovingApp] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    designationId: "",
    isCoreLeader: false,
    displayOrder: 50
  });
  const [approving, setApproving] = useState(false);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, desigData] = await Promise.all([
        membershipService.getAllApplications(),
        memberService.getDesignations()
      ]);
      const apps = Array.isArray(appsData) ? appsData : (appsData?.data || []);
      const desigs = Array.isArray(desigData) ? desigData : (desigData?.data || []);
      setApplications(apps);
      setDesignations(desigs);
      if (desigs.length > 0 && !approvalForm.designationId) {
        setApprovalForm((prev) => ({ ...prev, designationId: desigs[0].id }));
      }
    } catch (err) {
      console.error("Error loading membership applications:", err);
      setErrorMessage("Failed to load membership applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenApproveModal = (app) => {
    setApprovingApp(app);
    // Find default 'Member' designation if available
    const defaultDesig = designations.find(
      (d) => d.nameEnglish.toLowerCase().includes("member") || d.nameMarathi.includes("सदस्य")
    ) || designations[0];

    setApprovalForm({
      designationId: defaultDesig ? defaultDesig.id : (designations[0]?.id || ""),
      isCoreLeader: false,
      displayOrder: 50
    });
  };

  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    if (!approvingApp || !approvalForm.designationId) return;

    try {
      setApproving(true);
      await membershipService.approveApplication(approvingApp.id, {
        designationId: parseInt(approvalForm.designationId),
        isCoreLeader: approvalForm.isCoreLeader,
        displayOrder: parseInt(approvalForm.displayOrder) || 50
      });

      setSuccessMessage(`✅ ${approvingApp.fullNameMarathi || approvingApp.fullNameEnglish} has been approved and added to the Members directory!`);
      setApprovingApp(null);
      fetchData();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve application.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (app) => {
    if (!window.confirm(`Reject membership application for ${app.fullNameEnglish}?`)) return;

    try {
      await membershipService.rejectApplication(app.id);
      setSuccessMessage(`Application for ${app.fullNameEnglish} rejected.`);
      fetchData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      alert("Failed to reject application.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleting(true);
      await membershipService.deleteApplication(deletingId);
      setSuccessMessage("Application deleted.");
      setDeletingId(null);
      fetchData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      alert("Failed to delete application.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === "All" || app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      (app.fullNameEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.fullNameMarathi?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.district?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.mobileNumber?.includes(searchTerm) || false);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter((a) => a.status === "Pending").length;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
            Membership Requests (सदस्य अर्ज)
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Review new membership requests from citizens across Maharashtra and approve them into the active Members directory.
          </p>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.6rem 1.25rem",
          backgroundColor: pendingCount > 0 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
          border: `1px solid ${pendingCount > 0 ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)"}`,
          borderRadius: "var(--radius-full)",
          color: pendingCount > 0 ? "#F59E0B" : "#10B981",
          fontWeight: 700,
          fontSize: "0.9rem"
        }}>
          <Clock size={16} />
          <span>{pendingCount} Pending Requests</span>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{ padding: "0.85rem 1.25rem", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "8px", color: "#10B981", marginBottom: "1.5rem", fontWeight: 600 }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: "0.85rem 1.25rem", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#FCA5A5", marginBottom: "1.5rem" }}>
          {errorMessage}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ padding: "1.25rem", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Pending", "Approved", "Rejected", "All"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid",
                borderColor: filterStatus === st ? "var(--primary-gold)" : "rgba(212, 175, 55, 0.15)",
                backgroundColor: filterStatus === st ? "rgba(212, 175, 55, 0.15)" : "transparent",
                color: filterStatus === st ? "var(--primary-gold)" : "#94A3B8",
                fontWeight: filterStatus === st ? 700 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {st} {st === "Pending" && `(${pendingCount})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name, district, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.5rem", fontSize: "0.875rem" }}
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--primary-gold)" }}>
          <Loader2 size={36} className="spin" style={{ margin: "0 auto 1rem auto" }} />
          <p>Loading membership requests...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "4rem 2rem", color: "#94A3B8" }}>
          <UserCheck size={48} color="rgba(212, 175, 55, 0.4)" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 700 }}>No requests found</h3>
          <p style={{ marginTop: "0.5rem" }}>
            {filterStatus === "Pending" ? "There are currently no pending membership requests." : "No applications match your filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="admin-card"
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: `4px solid ${
                  app.status === "Approved" ? "#10B981" : app.status === "Rejected" ? "#EF4444" : "#F59E0B"
                }`
              }}
            >
              {/* Header with Photo & Name */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#0B1528",
                  border: "2px solid var(--primary-gold)",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {app.photoUrl ? (
                    <img src={app.photoUrl} alt="Applicant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "1.6rem" }}>👤</span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                        {app.fullNameEnglish}
                      </h4>
                      <div style={{ fontSize: "0.95rem", color: "var(--primary-gold)", fontWeight: 600 }}>
                        {app.fullNameMarathi}
                      </div>
                    </div>

                    <span style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      backgroundColor:
                        app.status === "Approved"
                          ? "rgba(16, 185, 129, 0.15)"
                          : app.status === "Rejected"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                      color:
                        app.status === "Approved"
                          ? "#10B981"
                          : app.status === "Rejected"
                          ? "#EF4444"
                          : "#F59E0B",
                      border: `1px solid ${
                        app.status === "Approved"
                          ? "rgba(16, 185, 129, 0.3)"
                          : app.status === "Rejected"
                          ? "rgba(239, 68, 68, 0.3)"
                          : "rgba(245, 158, 11, 0.3)"
                      }`
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicant Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem", color: "#CBD5E1", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={14} color="var(--primary-gold)" />
                  <a href={`tel:${app.mobileNumber}`} style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 600 }}>
                    {app.mobileNumber}
                  </a>
                </div>

                {app.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Mail size={14} color="var(--primary-gold)" />
                    <span style={{ color: "#94A3B8" }}>{app.email}</span>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <MapPin size={14} color="var(--primary-gold)" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                  <span>
                    <strong>{app.district}</strong>
                    {app.taluka ? ` • ${app.taluka}` : ""}
                    {app.villageOrCity ? ` • ${app.villageOrCity}` : ""}
                  </span>
                </div>

                {app.occupation && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Briefcase size={14} color="var(--primary-gold)" />
                    <span style={{ color: "#94A3B8" }}>{app.occupation}</span>
                  </div>
                )}

                {app.message && (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    borderRadius: "8px",
                    borderLeft: "2px solid var(--primary-gold)",
                    fontSize: "0.825rem",
                    color: "#94A3B8",
                    fontStyle: "italic"
                  }}>
                    "{app.message}"
                  </div>
                )}

                <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#64748B" }}>
                  <Calendar size={12} />
                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                {app.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleOpenApproveModal(app)}
                      className="btn btn-gold"
                      style={{ flex: 1, padding: "0.6rem", fontSize: "0.875rem", justifyContent: "center" }}
                    >
                      <CheckCircle size={16} />
                      <span>Approve (मान्यता द्या)</span>
                    </button>

                    <button
                      onClick={() => handleReject(app)}
                      style={{
                        padding: "0.6rem 1rem",
                        backgroundColor: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "var(--radius-sm)",
                        color: "#EF4444",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}
                      title="Reject Application"
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {app.status === "Approved" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontSize: "0.85rem", fontWeight: 600 }}>
                    <CheckCircle size={16} />
                    <span>Added to Members Directory</span>
                  </div>
                )}

                <button
                  onClick={() => setDeletingId(app.id)}
                  style={{
                    marginLeft: "auto",
                    padding: "0.6rem",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "var(--radius-sm)",
                    color: "#94A3B8",
                    cursor: "pointer"
                  }}
                  title="Delete Record"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal: Choose Designation */}
      {approvingApp && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#0F1A30",
            border: "1px solid var(--primary-gold)",
            borderRadius: "16px",
            padding: "2rem",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "0.75rem" }}>
              <UserCheck size={24} color="var(--primary-gold)" />
              <div>
                <h3 style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                  Approve Membership
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                  {approvingApp.fullNameEnglish} ({approvingApp.district})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmApprove}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">Assign Designation (पद) *</label>
                <select
                  className="input-field"
                  required
                  value={approvalForm.designationId}
                  onChange={(e) => setApprovalForm({ ...approvalForm, designationId: e.target.value })}
                >
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameEnglish} ({d.nameMarathi})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                  Select the organizational title for this new member.
                </p>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">Display Order (प्राधान्य क्रम)</label>
                <input
                  type="number"
                  className="input-field"
                  value={approvalForm.displayOrder}
                  onChange={(e) => setApprovalForm({ ...approvalForm, displayOrder: e.target.value })}
                  min="1"
                />
              </div>

              <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="checkbox"
                  id="isCoreLeader"
                  checked={approvalForm.isCoreLeader}
                  onChange={(e) => setApprovalForm({ ...approvalForm, isCoreLeader: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary-gold)" }}
                />
                <label htmlFor="isCoreLeader" style={{ color: "#FFFFFF", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600 }}>
                  Mark as Core Leadership (प्रमुख पदाधिकारी)
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setApprovingApp(null)}
                  style={{
                    padding: "0.65rem 1.25rem",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "var(--radius-sm)",
                    color: "#CBD5E1",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={approving}
                  className="btn btn-gold"
                  style={{ padding: "0.65rem 1.5rem" }}
                >
                  {approving ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Confirm Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingId && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Delete Membership Application"
          message="Are you sure you want to delete this membership request?"
          loading={deleting}
        />
      )}
    </div>
  );
};
