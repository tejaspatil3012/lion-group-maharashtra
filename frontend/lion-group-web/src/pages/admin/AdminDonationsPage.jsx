import React, { useState, useEffect } from "react";
import { donationService } from "../../services/donationService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  IndianRupee, 
  Plus, 
  Download, 
  Copy, 
  Users,
  Eye,
  Check,
  X
} from "lucide-react";

export const AdminDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Offline Entry Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Offline Form State
  const initialForm = {
    campaignId: "",
    donorName: "",
    donorMobile: "",
    donorEmail: "",
    donorPanNumber: "",
    city: "",
    amount: "",
    paymentMethod: "Cash",
    utrNumber: "",
    notes: ""
  };
  const [formData, setFormData] = useState(initialForm);

  // Detail / Verification Modal
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [actionStatus, setActionStatus] = useState("Approved");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadDonations();
  }, [statusFilter, campaignFilter, searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [campaignsData, statsData, donationsData] = await Promise.all([
        donationService.getAllCampaigns(),
        donationService.getStats(),
        donationService.getDonationsList(
          statusFilter || null,
          campaignFilter ? parseInt(campaignFilter, 10) : null,
          searchQuery || null
        )
      ]);
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      setStats(statsData || null);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      const data = await donationService.getDonationsList(
        statusFilter || null,
        campaignFilter ? parseInt(campaignFilter, 10) : null,
        searchQuery || null
      );
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load donations:", err);
    }
  };

  const handleVerify = async (id, status) => {
    const actionText = status === "Approved" ? "approve and credit" : "reject";
    if (window.confirm(`Are you sure you want to ${actionText} this donation?`)) {
      try {
        await donationService.verifyDonation(id, status);
        loadDonations();
        const updatedStats = await donationService.getStats();
        setStats(updatedStats);
      } catch (err) {
        alert("Failed to update status.");
      }
    }
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    if (!formData.donorName.trim() || !formData.donorMobile.trim() || !formData.amount) {
      alert("Please enter donor name, mobile, and amount.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        campaignId: formData.campaignId ? parseInt(formData.campaignId, 10) : null,
        donorName: formData.donorName.trim(),
        donorMobile: formData.donorMobile.trim(),
        donorEmail: formData.donorEmail.trim() || null,
        donorPanNumber: formData.donorPanNumber.trim().toUpperCase() || null,
        city: formData.city.trim() || null,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        utrNumber: formData.utrNumber.trim() || null,
        notes: formData.notes.trim() || null
      };

      await donationService.submitDonation(payload);
      setAddModalOpen(false);
      setFormData(initialForm);
      loadDonations();
      const updatedStats = await donationService.getStats();
      setStats(updatedStats);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record offline donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Title & Add Button */}
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
            Donation Ledger (देणगी नोंदवही व पडताळणी)
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Track received donations, verify UPI UTR references, and log offline cash contributions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn btn-gold"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={18} />
          Record Offline Donation (रोख / बँक देणगी)
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem"
        }}>
          <div className="admin-card" style={{ borderLeft: "4px solid var(--primary-gold)" }}>
            <span style={{ fontSize: "0.825rem", color: "var(--text-light-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Total Funds Raised
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--primary-gold)", marginTop: "0.25rem" }}>
              ₹{Number(stats.totalRaised || 0).toLocaleString("en-IN")}
            </div>
          </div>

          <div className="admin-card" style={{ borderLeft: "4px solid #10B981" }}>
            <span style={{ fontSize: "0.825rem", color: "var(--text-light-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              This Month
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#10B981", marginTop: "0.25rem" }}>
              ₹{Number(stats.thisMonthRaised || 0).toLocaleString("en-IN")}
            </div>
          </div>

          <div className="admin-card" style={{ borderLeft: "4px solid #F59E0B" }}>
            <span style={{ fontSize: "0.825rem", color: "var(--text-light-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Pending Verification
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#F59E0B", marginTop: "0.25rem" }}>
              {stats.pendingVerificationsCount} {stats.pendingVerificationsCount > 0 ? "needs review" : "clear"}
            </div>
          </div>

          <div className="admin-card" style={{ borderLeft: "4px solid #3B82F6" }}>
            <span style={{ fontSize: "0.825rem", color: "var(--text-light-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Generous Donors
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#3B82F6", marginTop: "0.25rem" }}>
              {stats.totalDonorsCount} donors
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="admin-card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <Search size={16} color="var(--text-light-muted)" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by Donor Name, Mobile, Receipt, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <select
          className="input-field"
          style={{ width: "auto", minWidth: "170px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending (अपेक्षित)</option>
          <option value="Approved">Approved (मान्यताप्राप्त)</option>
          <option value="Rejected">Rejected (नाकारलेले)</option>
        </select>

        <select
          className="input-field"
          style={{ width: "auto", minWidth: "200px" }}
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
        >
          <option value="">All Campaigns / Causes</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.titleEnglish}
            </option>
          ))}
        </select>
      </div>

      {/* Donations Table */}
      {loading ? (
        <LoadingSpinner message="Loading Donations..." />
      ) : donations.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3rem" }}>
          <HeartHandshake size={48} color="var(--primary-gold)" style={{ margin: "0 auto 1rem auto" }} />
          <p style={{ color: "var(--text-light-muted)" }}>No donation records matching current filters.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ overflowX: "auto", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "1rem" }}>Receipt & Date</th>
                <th style={{ padding: "1rem" }}>Donor Details</th>
                <th style={{ padding: "1rem" }}>Cause / Campaign</th>
                <th style={{ padding: "1rem" }}>Amount (₹)</th>
                <th style={{ padding: "1rem" }}>Method & UTR</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    transition: "background 0.15s ease"
                  }}
                >
                  {/* Receipt & Date */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--primary-gold)" }}>
                      {d.receiptNumber}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-light-muted)", marginTop: "0.2rem" }}>
                      {new Date(d.donatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </td>

                  {/* Donor */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-light)" }}>
                      {d.donorName} {d.isAnonymous && <span style={{ fontSize: "0.7rem", color: "var(--text-light-muted)" }}>(Anonymous)</span>}
                    </div>
                    <div style={{ fontSize: "0.775rem", color: "var(--text-light-muted)" }}>
                      {d.donorMobile} {d.city ? `• ${d.city}` : ""}
                    </div>
                    {d.donorPanNumber && (
                      <div style={{ fontSize: "0.7rem", color: "var(--primary-gold-dark)" }}>
                        PAN: {d.donorPanNumber}
                      </div>
                    )}
                  </td>

                  {/* Cause */}
                  <td style={{ padding: "1rem", maxWidth: "200px" }}>
                    <div style={{ color: "var(--text-light)", fontWeight: 600 }}>
                      {d.campaignTitleEnglish || "General Social Fund"}
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--primary-gold)" }}>
                      ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                    </div>
                  </td>

                  {/* Method & UTR */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-light)" }}>
                      {d.paymentMethod}
                    </div>
                    {d.utrNumber && (
                      <div style={{
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        color: "#93C5FD",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        marginTop: "0.2rem"
                      }}>
                        <span>UTR: {d.utrNumber}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(d.utrNumber);
                            alert("UTR copied!");
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-gold)" }}
                          title="Copy UTR"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "1rem" }}>
                    <span className={`badge ${
                      d.paymentStatus === "Approved" ? "badge-tree" : d.paymentStatus === "Pending" ? "badge-gold" : "badge-blood"
                    }`}>
                      {d.paymentStatus === "Approved" && <CheckCircle2 size={12} style={{ marginRight: "0.25rem" }} />}
                      {d.paymentStatus === "Pending" && <Clock size={12} style={{ marginRight: "0.25rem" }} />}
                      {d.paymentStatus === "Rejected" && <XCircle size={12} style={{ marginRight: "0.25rem" }} />}
                      {d.paymentStatus}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    {d.paymentStatus === "Pending" && (
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => handleVerify(d.id, "Approved")}
                          className="btn btn-gold"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.775rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                          title="Approve UTR & Credit Campaign"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerify(d.id, "Rejected")}
                          className="btn btn-danger"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.775rem" }}
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    {d.paymentStatus === "Approved" && (
                      <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>
                        ✓ Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offline Donation Modal */}
      {addModalOpen && (
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
            maxWidth: "540px",
            width: "100%",
            padding: "2rem",
            color: "#FFFFFF",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.5rem" }}>
              Record Offline Donation (रोख / बँक देणगी नोंद)
            </h2>

            <form onSubmit={handleOfflineSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label className="admin-label">Campaign / Cause</label>
                <select
                  className="input-field"
                  value={formData.campaignId}
                  onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                >
                  <option value="">General Social Welfare Fund (सर्वसाधारण निधी)</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titleEnglish} ({c.titleMarathi})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">Donor Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Suresh Patil"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Donor Mobile *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+91 9876543210"
                    value={formData.donorMobile}
                    onChange={(e) => setFormData({ ...formData, donorMobile: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">Donation Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    className="input-field"
                    placeholder="e.g. 5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Payment Mode *</label>
                  <select
                    className="input-field"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="Cash">Cash (रोख रक्कम)</option>
                    <option value="BankTransfer">Direct Bank Transfer / NEFT / Cheque</option>
                    <option value="UPI">UPI Direct</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="admin-label">City / Village</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Jalgaon"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Cheque / UTR No. (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Reference / Cheque No."
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label className="admin-label">Notes (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Received during meeting"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
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
                  {submitting ? "Saving..." : "Save & Generate Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
