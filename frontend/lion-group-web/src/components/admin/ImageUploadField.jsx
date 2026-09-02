import React, { useState, useRef } from "react";
import { getImageUrl } from "../../services/api";
import { uploadService } from "../../services/uploadService";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

export const ImageUploadField = ({ label, value, onChange, placeholder = "Upload photo or paste URL" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      const res = await uploadService.uploadImage(file);
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setError("");
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {label && (
        <label className="admin-label">
          {label}
        </label>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {/* Preview Thumbnail */}
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "8px",
          backgroundColor: "#070D1E",
          border: "1.5px solid rgba(212, 175, 55, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0
        }}>
          {value ? (
            <img
              src={getImageUrl(value)}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <ImageIcon size={22} color="var(--primary-gold)" />
          )}
        </div>

        {/* Input & Upload Button */}
        <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            className="input-field"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ flex: 1 }}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="btn btn-outline-gold"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Upload</span>
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClear}
              title="Clear photo"
              style={{ padding: "0.6rem", color: "#EF4444" }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p style={{ color: "#EF4444", fontSize: "0.8rem", marginTop: "0.35rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};
