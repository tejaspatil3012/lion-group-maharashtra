import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { eventService } from "../../services/eventService";
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
  X,
  Save,
  Loader2
} from "lucide-react";

export const AdminEventsPage = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    titleEnglish: "",
    titleMarathi: "",
    descriptionEnglish: "",
    descriptionMarathi: "",
    venue: "",
    district: "Pune",
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: "",
    chiefGuests: "",
    bannerImageUrl: "",
    status: "Upcoming",
    isFeatured: false
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleOpenAddModal();
    }
  }, [searchParams]);

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      titleEnglish: event.titleEnglish || "",
      titleMarathi: event.titleMarathi || "",
      descriptionEnglish: event.descriptionEnglish || "",
      descriptionMarathi: event.descriptionMarathi || "",
      venue: event.venue || "",
      district: event.district || "Pune",
      startDateTime: event.startDateTime ? new Date(event.startDateTime).toISOString().slice(0, 16) : "",
      endDateTime: event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 16) : "",
      chiefGuests: event.chiefGuests || "",
      bannerImageUrl: event.bannerImageUrl || "",
      status: event.status || "Upcoming",
      isFeatured: Boolean(event.isFeatured)
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.titleEnglish.trim() || !formData.titleMarathi.trim() || !formData.venue.trim()) {
      setFormError("Titles and venue are required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      const payload = {
        ...formData,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: formData.endDateTime ? new Date(formData.endDateTime).toISOString() : null
      };

      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, payload);
      } else {
        await eventService.createEvent(payload);
      }

      setIsModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setFormError(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      setDeleting(true);
      await eventService.deleteEvent(eventToDelete.id);
      setDeleteModalOpen(false);
      setEventToDelete(null);
      await fetchEvents();
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      (ev.titleEnglish && ev.titleEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.titleMarathi && ev.titleMarathi.includes(searchTerm)) ||
      (ev.venue && ev.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Events & Conclaves Management
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
            Add, update, or schedule state conventions, youth conclaves, and social gatherings.
          </p>
        </div>

        <button type="button" className="btn btn-gold" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="admin-card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search event by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        <select
          className="input-field"
          style={{ width: "auto", minWidth: "180px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Upcoming">Upcoming (आगामी)</option>
          <option value="Completed">Completed (संपन्न)</option>
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <LoadingSpinner message="Loading Events..." />
      ) : filteredEvents.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <p style={{ color: "var(--text-light-muted)", marginBottom: "1.25rem", fontSize: "1rem" }}>No events found.</p>
          <button type="button" className="btn btn-outline-gold" onClick={handleOpenAddModal}>
            Create First Event
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="admin-card"
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {/* Banner Image */}
              <div style={{ height: "160px", backgroundColor: "#070D1E", position: "relative", overflow: "hidden" }}>
                {ev.bannerImageUrl ? (
                  <img src={ev.bannerImageUrl} alt={ev.titleEnglish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    📅
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  backgroundColor: ev.status === "Upcoming" ? "#10B981" : "rgba(255,255,255,0.2)",
                  color: "#FFFFFF",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {ev.status}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                    {ev.titleEnglish}
                  </h3>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--primary-gold)", fontFamily: "var(--font-marathi)", marginBottom: "0.75rem" }}>
                    {ev.titleMarathi}
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-light-muted)", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={14} color="var(--primary-gold)" />
                      <span>{new Date(ev.startDateTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <MapPin size={14} color="var(--primary-gold)" />
                      <span>{ev.venue}, {ev.district}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: "0.85rem" }}>
                  <button
                    type="button"
                    className="btn btn-outline-gold"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}
                    onClick={() => handleOpenEditModal(ev)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem", color: "#EF4444" }}
                    onClick={() => {
                      setEventToDelete(ev);
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
                {editingEvent ? "Edit Event Details" : "Create New Event"}
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

            <form onSubmit={handleSaveEvent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Event Title (English) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. State Annual Convention 2026"
                    value={formData.titleEnglish}
                    onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">कार्यक्रमाचे नाव (मराठी) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="उदा. राज्य वार्षिक महाअधिवेशन २०२६"
                    value={formData.titleMarathi}
                    onChange={(e) => setFormData({ ...formData, titleMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Venue & District */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Venue (स्थळ) *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Balewadi Sports Complex, Pune"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
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

              {/* Dates & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    required
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Status</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Upcoming">Upcoming (आगामी)</option>
                    <option value="Completed">Completed (संपन्न)</option>
                    <option value="Postponed">Postponed (पुढे ढकलले)</option>
                  </select>
                </div>
              </div>

              {/* Chief Guests */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">Chief Guests & Dignitaries (प्रमुख पाहुणे)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. State Ministers, Social Reformers, Presidents"
                  value={formData.chiefGuests}
                  onChange={(e) => setFormData({ ...formData, chiefGuests: e.target.value })}
                />
              </div>

              {/* Descriptions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="admin-label">Description (English)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Event details and purpose..."
                    value={formData.descriptionEnglish}
                    onChange={(e) => setFormData({ ...formData, descriptionEnglish: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">सविस्तर माहिती (मराठी)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="कार्यक्रमाचे स्वरूप व नियोजन..."
                    value={formData.descriptionMarathi}
                    onChange={(e) => setFormData({ ...formData, descriptionMarathi: e.target.value })}
                  />
                </div>
              </div>

              {/* Banner Image */}
              <ImageUploadField
                label="Event Banner Image"
                value={formData.bannerImageUrl}
                onChange={(url) => setFormData({ ...formData, bannerImageUrl: url })}
                placeholder="/uploads/event_banner.jpg or upload directly"
              />

              {/* Featured Checkbox */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem", color: "#FFFFFF" }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Feature on Homepage Spotlight (मुख्यपृष्ठावर दर्शवा)</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                      <span>{editingEvent ? "Update Event" : "Save Event"}</span>
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
        title="Delete Event"
        message={`Are you sure you want to remove the event "${eventToDelete?.titleEnglish}"?`}
        onConfirm={handleDeleteEvent}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};
