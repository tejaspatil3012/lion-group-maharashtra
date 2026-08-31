import React, { useEffect, useState } from "react";
import { contactService } from "../../services/contactService";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  Mail,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  User
} from "lucide-react";

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllInquiries();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async () => {
    if (!inquiryToDelete) return;
    try {
      setDeleting(true);
      await contactService.deleteInquiry(inquiryToDelete.id);
      setDeleteModalOpen(false);
      setInquiryToDelete(null);
      await fetchInquiries();
    } catch (err) {
      alert("Failed to delete inquiry: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
          Contact Messages & Inquiries
        </h1>
        <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
          Messages and inquiries received from citizens across Maharashtra via the public contact form.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading Inquiries..." />
      ) : inquiries.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <Mail size={42} color="var(--primary-gold)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>No Messages Yet</h3>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.9rem" }}>When visitors submit messages through the contact page, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {inquiries.map((inq) => (
            <div key={inq.id} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary-gold)", margin: 0, marginBottom: "0.35rem" }}>
                    {inq.subject}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.25rem", fontSize: "0.875rem", color: "var(--text-light-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#FFFFFF", fontWeight: 600 }}>
                      <User size={14} color="var(--primary-gold)" />
                      <span>{inq.fullName}</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Phone size={14} color="var(--primary-gold)" />
                      <a href={`tel:${inq.mobileNumber}`} style={{ color: "inherit", textDecoration: "none" }}>{inq.mobileNumber}</a>
                    </span>
                    {inq.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={14} color="var(--primary-gold)" />
                        <a href={`mailto:${inq.email}`} style={{ color: "inherit", textDecoration: "none" }}>{inq.email}</a>
                      </span>
                    )}
                    {inq.district && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={14} color="var(--primary-gold)" />
                        <span>{inq.district}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.825rem", color: "var(--text-light-muted)" }}>
                    <Calendar size={14} />
                    <span>{new Date(inq.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "0.45rem", color: "#EF4444" }}
                    onClick={() => {
                      setInquiryToDelete(inq);
                      setDeleteModalOpen(true);
                    }}
                    title="Delete Message"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                padding: "1.1rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(212, 175, 55, 0.18)",
                fontSize: "0.925rem",
                color: "#E2E8F0",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>
                {inq.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Inquiry Message"
        message={`Are you sure you want to delete the message from "${inquiryToDelete?.fullName}"?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setInquiryToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};
