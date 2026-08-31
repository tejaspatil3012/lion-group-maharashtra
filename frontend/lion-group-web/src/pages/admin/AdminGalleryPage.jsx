import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { galleryService } from "../../services/galleryService";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Calendar,
  X,
  Save,
  Loader2
} from "lucide-react";

export const AdminGalleryPage = () => {
  const [searchParams] = useSearchParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  // Album Modal
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumFormData, setAlbumFormData] = useState({
    titleEnglish: "",
    titleMarathi: "",
    descriptionEnglish: "",
    descriptionMarathi: "",
    coverImageUrl: "",
    eventDate: new Date().toISOString().slice(0, 10),
    isActive: true
  });
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [albumFormError, setAlbumFormError] = useState("");

  // Photos Management Modal
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [newImageForm, setNewImageForm] = useState({
    imageUrl: "",
    captionEnglish: "",
    captionMarathi: "",
    displayOrder: 1
  });
  const [addingImage, setAddingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Delete Album Modal
  const [deleteAlbumModalOpen, setDeleteAlbumModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [deletingAlbum, setDeletingAlbum] = useState(false);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAlbums();
      setAlbums(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching gallery albums:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleOpenCreateAlbum();
    }
  }, [searchParams]);

  const handleOpenCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumFormData({
      titleEnglish: "",
      titleMarathi: "",
      descriptionEnglish: "",
      descriptionMarathi: "",
      coverImageUrl: "",
      eventDate: new Date().toISOString().slice(0, 10),
      isActive: true
    });
    setAlbumFormError("");
    setAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (album) => {
    setEditingAlbum(album);
    setAlbumFormData({
      titleEnglish: album.titleEnglish || "",
      titleMarathi: album.titleMarathi || "",
      descriptionEnglish: album.descriptionEnglish || "",
      descriptionMarathi: album.descriptionMarathi || "",
      coverImageUrl: album.coverImageUrl || "",
      eventDate: album.eventDate ? new Date(album.eventDate).toISOString().slice(0, 10) : "",
      isActive: album.isActive !== false
    });
    setAlbumFormError("");
    setAlbumModalOpen(true);
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();
    if (!albumFormData.titleEnglish.trim() || !albumFormData.titleMarathi.trim() || !albumFormData.coverImageUrl.trim()) {
      setAlbumFormError("Titles and Cover Image are required.");
      return;
    }

    try {
      setSavingAlbum(true);
      setAlbumFormError("");
      const payload = {
        ...albumFormData,
        eventDate: new Date(albumFormData.eventDate).toISOString()
      };

      if (editingAlbum) {
        await galleryService.updateAlbum(editingAlbum.id, payload);
      } else {
        await galleryService.createAlbum(payload);
      }

      setAlbumModalOpen(false);
      await fetchAlbums();
    } catch (err) {
      setAlbumFormError(err.message || "Failed to save album.");
    } finally {
      setSavingAlbum(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    try {
      setDeletingAlbum(true);
      await galleryService.deleteAlbum(albumToDelete.id);
      setDeleteAlbumModalOpen(false);
      setAlbumToDelete(null);
      await fetchAlbums();
    } catch (err) {
      alert("Failed to delete album: " + err.message);
    } finally {
      setDeletingAlbum(false);
    }
  };

  const handleOpenPhotosManager = async (album) => {
    try {
      const fullAlbum = await galleryService.getAlbumById(album.id);
      setActiveAlbum(fullAlbum || album);
      setNewImageForm({
        imageUrl: "",
        captionEnglish: "",
        captionMarathi: "",
        displayOrder: (fullAlbum?.images?.length || 0) + 1
      });
      setImageError("");
      setPhotosModalOpen(true);
    } catch (err) {
      console.error("Error loading album photos:", err);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageForm.imageUrl.trim()) {
      setImageError("Please upload or enter an image URL.");
      return;
    }

    try {
      setAddingImage(true);
      setImageError("");
      await galleryService.addImageToAlbum(activeAlbum.id, newImageForm);
      const updatedAlbum = await galleryService.getAlbumById(activeAlbum.id);
      setActiveAlbum(updatedAlbum);
      setNewImageForm({
        imageUrl: "",
        captionEnglish: "",
        captionMarathi: "",
        displayOrder: (updatedAlbum?.images?.length || 0) + 1
      });
      await fetchAlbums();
    } catch (err) {
      setImageError(err.message || "Failed to add image.");
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await galleryService.deleteImage(imageId);
      const updatedAlbum = await galleryService.getAlbumById(activeAlbum.id);
      setActiveAlbum(updatedAlbum);
      await fetchAlbums();
    } catch (err) {
      alert("Failed to delete photo: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
            Photo Gallery & Albums Management
          </h1>
          <p style={{ color: "var(--text-light-muted)", fontSize: "0.95rem" }}>
            Create albums, upload event photos, and manage image captions.
          </p>
        </div>

        <button type="button" className="btn btn-gold" onClick={handleOpenCreateAlbum}>
          <Plus size={18} />
          <span>Create New Album</span>
        </button>
      </div>

      {/* Albums Grid */}
      {loading ? (
        <LoadingSpinner message="Loading Gallery..." />
      ) : albums.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <p style={{ color: "var(--text-light-muted)", marginBottom: "1.25rem", fontSize: "1rem" }}>No photo albums created yet.</p>
          <button type="button" className="btn btn-outline-gold" onClick={handleOpenCreateAlbum}>
            Create First Album
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {albums.map((album) => (
            <div
              key={album.id}
              className="admin-card"
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {/* Cover Photo */}
              <div style={{ height: "180px", backgroundColor: "#070D1E", position: "relative", overflow: "hidden" }}>
                {album.coverImageUrl ? (
                  <img src={album.coverImageUrl} alt={album.titleEnglish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    📸
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  bottom: "0.75rem",
                  right: "0.75rem",
                  backgroundColor: "rgba(7, 13, 30, 0.85)",
                  color: "var(--primary-gold)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <ImageIcon size={13} />
                  <span>{album.totalImages} Photos</span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.3rem" }}>
                    {album.titleEnglish}
                  </h3>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--primary-gold)", fontFamily: "var(--font-marathi)", marginBottom: "0.75rem" }}>
                    {album.titleMarathi}
                  </h4>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.825rem", color: "var(--text-light-muted)", marginBottom: "1rem" }}>
                    <Calendar size={14} color="var(--primary-gold)" />
                    <span>{new Date(album.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: "0.85rem" }}>
                  <button
                    type="button"
                    className="btn btn-gold"
                    style={{ padding: "0.45rem 0.95rem", fontSize: "0.85rem" }}
                    onClick={() => handleOpenPhotosManager(album)}
                  >
                    <ImageIcon size={14} />
                    <span>Manage Photos ({album.totalImages})</span>
                  </button>

                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: "0.4rem", color: "var(--primary-gold)" }}
                      onClick={() => handleOpenEditAlbum(album)}
                      title="Edit Album Details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: "0.4rem", color: "#EF4444" }}
                      onClick={() => {
                        setAlbumToDelete(album);
                        setDeleteAlbumModalOpen(true);
                      }}
                      title="Delete Album"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Album Modal */}
      {albumModalOpen && (
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
            maxWidth: "600px",
            width: "100%",
            padding: "2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            color: "#F8FAFC"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-heading)" }}>
                {editingAlbum ? "Edit Album Details" : "Create New Photo Album"}
              </h3>
              <button type="button" className="btn btn-ghost" onClick={() => setAlbumModalOpen(false)} style={{ padding: "0.4rem", color: "var(--text-light-muted)" }}>
                <X size={22} />
              </button>
            </div>

            {albumFormError && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#FCA5A5", padding: "0.85rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
                {albumFormError}
              </div>
            )}

            <form onSubmit={handleSaveAlbum}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">Album Title (English) *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. State Blood Donation Camp Photo Album"
                  value={albumFormData.titleEnglish}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, titleEnglish: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">अल्बम शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="उदा. राज्यस्तरीय रक्तदान शिबिर छायाचित्रे"
                  value={albumFormData.titleMarathi}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, titleMarathi: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label">Event Date (दिनांक) *</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={albumFormData.eventDate}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, eventDate: e.target.value })}
                />
              </div>

              {/* Cover Photo */}
              <ImageUploadField
                label="Album Cover Photo *"
                value={albumFormData.coverImageUrl}
                onChange={(url) => setAlbumFormData({ ...albumFormData, coverImageUrl: url })}
                placeholder="/uploads/album_cover.jpg or upload"
              />

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.75rem" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setAlbumModalOpen(false)} disabled={savingAlbum}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: "0.7rem 1.8rem" }} disabled={savingAlbum}>
                  {savingAlbum ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingAlbum ? "Update Album" : "Create Album"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photos Manager Modal */}
      {photosModalOpen && activeAlbum && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(3, 7, 18, 0.88)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 110,
          padding: "1.25rem"
        }}>
          <div style={{
            backgroundColor: "#0B1528",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "16px",
            maxWidth: "880px",
            width: "100%",
            maxHeight: "92vh",
            overflowY: "auto",
            padding: "2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            color: "#F8FAFC"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-heading)" }}>
                  Manage Album Photos: {activeAlbum.titleEnglish}
                </h3>
                <div style={{ fontSize: "0.9rem", color: "var(--primary-gold)", fontFamily: "var(--font-marathi)" }}>
                  {activeAlbum.titleMarathi}
                </div>
              </div>

              <button type="button" className="btn btn-ghost" onClick={() => setPhotosModalOpen(false)} style={{ padding: "0.4rem", color: "var(--text-light-muted)" }}>
                <X size={22} />
              </button>
            </div>

            {/* Add Photo Form */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary-gold)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <Plus size={18} />
                <span>Add New Photo to Album</span>
              </h4>

              {imageError && (
                <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#FCA5A5", padding: "0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.85rem" }}>
                  {imageError}
                </div>
              )}

              <form onSubmit={handleAddImage}>
                <ImageUploadField
                  label="Upload Picture *"
                  value={newImageForm.imageUrl}
                  onChange={(url) => setNewImageForm({ ...newImageForm, imageUrl: url })}
                  placeholder="Upload picture file or paste URL"
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label className="admin-label">Caption (English)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Mass plantation drive in Nashik"
                      value={newImageForm.captionEnglish}
                      onChange={(e) => setNewImageForm({ ...newImageForm, captionEnglish: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-label">कॅप्शन (मराठी)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="उदा. नाशिक येथे वृक्षारोपण मोहीम"
                      value={newImageForm.captionMarathi}
                      onChange={(e) => setNewImageForm({ ...newImageForm, captionMarathi: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" disabled={addingImage} style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
                  {addingImage ? "Uploading Photo..." : "Upload & Add Photo to Album"}
                </button>
              </form>
            </div>

            {/* Current Photos Grid */}
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
              Photos in this Album ({activeAlbum.images?.length || 0})
            </h4>

            {activeAlbum.images?.length === 0 ? (
              <p style={{ color: "var(--text-light-muted)", fontSize: "0.9rem" }}>No photos uploaded to this album yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {activeAlbum.images?.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      position: "relative"
                    }}
                  >
                    <div style={{ height: "140px", backgroundColor: "#070D1E" }}>
                      <img src={img.imageUrl} alt={img.captionEnglish || "Album Image"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ padding: "0.65rem", fontSize: "0.8rem", color: "var(--text-light-muted)" }}>
                      <div style={{ color: "#FFFFFF", fontWeight: 600 }}>{img.captionEnglish || "No caption"}</div>
                      <div style={{ color: "var(--primary-gold)", fontFamily: "var(--font-marathi)", fontSize: "0.78rem" }}>{img.captionMarathi}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      title="Delete Photo"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(220, 38, 38, 0.95)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.5)"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Album Modal */}
      <DeleteConfirmModal
        isOpen={deleteAlbumModalOpen}
        title="Delete Photo Album"
        message={`Are you sure you want to delete the album "${albumToDelete?.titleEnglish}" and all its photos?`}
        onConfirm={handleDeleteAlbum}
        onCancel={() => {
          setDeleteAlbumModalOpen(false);
          setAlbumToDelete(null);
        }}
        loading={deletingAlbum}
      />
    </div>
  );
};
