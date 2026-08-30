import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { galleryService } from "../services/galleryService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export const AlbumDetailPage = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox state
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getAlbumById(id);
      setAlbum(data);
    } catch (err) {
      console.error("Error loading album:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, album]);

  const handlePrevImage = () => {
    if (!album || !album.images.length) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : album.images.length - 1));
  };

  const handleNextImage = () => {
    if (!album || !album.images.length) return;
    setActiveImageIndex((prev) => (prev < album.images.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAlbum} />;
  if (!album) return <ErrorMessage message="Album not found" />;

  const title = lang === "mr" ? (album.titleMarathi || album.titleEnglish) : album.titleEnglish;
  const desc = lang === "mr" ? (album.descriptionMarathi || album.descriptionEnglish) : album.descriptionEnglish;

  return (
    <div>
      <PageHeader
        badge={t.gallery.badge}
        title={title}
        subtitle={desc || `${album.images.length} ${t.gallery.photosCount}`}
        breadcrumb={[
          { label: t.nav.gallery, link: "/gallery" },
          { label: title }
        ]}
      />

      <section className="section">
        <div className="container">
          {/* Back Button */}
          <Link
            to="/gallery"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary-gold-dark)",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginBottom: "2rem",
              textDecoration: "none"
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.common.backToList}</span>
          </Link>

          {/* Photos Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}>
            {album.images.map((img, idx) => {
              const caption = lang === "mr" ? (img.captionMarathi || img.captionEnglish) : img.captionEnglish;

              return (
                <div
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    position: "relative",
                    height: "240px",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-md)",
                    backgroundColor: "#070D1E"
                  }}
                  className="card-white"
                >
                  <img
                    src={img.imageUrl}
                    alt={caption || title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Overlay on hover */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(7, 13, 30, 0.85) 0%, transparent 60%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "1rem",
                    color: "#FFFFFF"
                  }}>
                    {caption && (
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                        {caption}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--primary-gold)" }}>
                      <Maximize2 size={12} />
                      <span>{lang === "mr" ? "मोठे करून पहा" : "Click to Enlarge"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && album.images[activeImageIndex] && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.92)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          {/* Close button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer",
              zIndex: 2010
            }}
          >
            <X size={24} />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevImage}
            style={{
              position: "absolute",
              left: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer",
              zIndex: 2010
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={handleNextImage}
            style={{
              position: "absolute",
              right: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer",
              zIndex: 2010
            }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Center Image */}
          <div style={{ maxWidth: "90vw", maxHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src={album.images[activeImageIndex].imageUrl}
              alt={album.images[activeImageIndex].captionEnglish || "Gallery Photo"}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
                border: "2px solid rgba(212, 175, 55, 0.4)"
              }}
            />

            {/* Lightbox Caption */}
            <div style={{
              marginTop: "1rem",
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 600
            }}>
              {lang === "mr"
                ? (album.images[activeImageIndex].captionMarathi || album.images[activeImageIndex].captionEnglish)
                : album.images[activeImageIndex].captionEnglish}
              <div style={{ fontSize: "0.8rem", color: "var(--primary-gold)", marginTop: "0.25rem" }}>
                {activeImageIndex + 1} / {album.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
