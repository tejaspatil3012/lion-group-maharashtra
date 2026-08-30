import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { galleryService } from "../services/galleryService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { Image as ImageIcon, Calendar, ArrowRight } from "lucide-react";

export const GalleryPage = () => {
  const { lang, t } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getAlbums();
      setAlbums(data);
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <PageHeader
        badge={t.gallery.badge}
        title={t.gallery.title}
        subtitle={t.gallery.subtitle}
        breadcrumb={[{ label: t.gallery.title }]}
      />

      <section className="section">
        <div className="container">
          {loading ? (
            <LoadingSpinner message={t.common.loading} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAlbums} />
          ) : albums.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1rem",
              backgroundColor: "#F8FAFC",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed #CBD5E1"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🖼️</div>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {t.common.noData}
              </h3>
            </div>
          ) : (
            <div className="grid-3">
              {albums.map((album) => {
                const title = lang === "mr" ? (album.titleMarathi || album.titleEnglish) : album.titleEnglish;
                const desc = lang === "mr" ? (album.descriptionMarathi || album.descriptionEnglish) : album.descriptionEnglish;
                const formattedDate = new Date(album.eventDate).toLocaleDateString(
                  lang === "mr" ? "mr-IN" : "en-IN",
                  { month: "short", year: "numeric" }
                );

                return (
                  <Link
                    key={album.id}
                    to={`/gallery/${album.id}`}
                    className="card-white"
                    style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}
                  >
                    {/* Cover Image */}
                    <div style={{ position: "relative", height: "240px", overflow: "hidden", backgroundColor: "#070D1E" }}>
                      <img
                        src={album.coverImageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"}
                        alt={title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      
                      <div style={{
                        position: "absolute",
                        bottom: "1rem",
                        right: "1rem",
                        backgroundColor: "rgba(7, 13, 30, 0.85)",
                        border: "1px solid rgba(212, 175, 55, 0.4)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.25rem 0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        color: "#FFFFFF",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}>
                        <ImageIcon size={13} color="var(--primary-gold)" />
                        <span>{album.totalImages} {t.gallery.photosCount}</span>
                      </div>
                    </div>

                    {/* Album Details */}
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.825rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem"
                      }}>
                        <Calendar size={14} color="var(--primary-gold-dark)" />
                        <span>{formattedDate}</span>
                      </div>

                      <h3 style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-heading)",
                        color: "var(--text-main)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3
                      }}>
                        {title}
                      </h3>

                      {desc && (
                        <p style={{
                          fontSize: "0.9rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                          marginBottom: "1rem",
                          flex: 1
                        }}>
                          {desc}
                        </p>
                      )}

                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--primary-gold-dark)",
                        marginTop: "auto"
                      }}>
                        <span>{lang === "mr" ? "अल्बम उघडा" : "View Album"}</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
