import React, { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { contactService } from "../services/contactService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner, ErrorMessage } from "../components/common/LoadingSpinner";
import { MAHARASHTRA_DISTRICTS } from "../utils/constants";
import { MapPin, Phone, Mail, Heart, Send, CheckCircle2, AlertCircle } from "lucide-react";

export const ContactPage = () => {
  const { lang, t } = useLanguage();
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    district: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getContactInfo();
      setContactInfo(data);
    } catch (err) {
      console.error("Error loading contact info:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(false);

    // Basic Validation
    if (!formData.fullName.trim()) {
      setFormErrors([lang === "mr" ? "कृपया आपले पूर्ण नाव प्रविष्ट करा." : "Please enter your full name."]);
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setFormErrors([lang === "mr" ? "कृपया आपला मोबाईल नंबर प्रविष्ट करा." : "Please enter your mobile number."]);
      return;
    }
    if (!formData.subject.trim()) {
      setFormErrors([lang === "mr" ? "कृपया विषयाची नोंद करा." : "Please enter a subject."]);
      return;
    }
    if (!formData.message.trim()) {
      setFormErrors([lang === "mr" ? "कृपया आपला संदेश प्रविष्ट करा." : "Please enter your message."]);
      return;
    }

    try {
      setSubmitting(true);
      await contactService.submitInquiry(formData);
      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        district: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setFormErrors([err.message || "Failed to submit inquiry"]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message={t.common.loading} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchContactData} />;

  const address = lang === "mr"
    ? (contactInfo?.headOfficeAddressMarathi || contactInfo?.headOfficeAddressEnglish)
    : contactInfo?.headOfficeAddressEnglish;

  return (
    <div>
      <PageHeader
        badge={t.contact.badge}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        breadcrumb={[{ label: t.contact.title }]}
      />

      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3.5rem"
          }} className="contact-grid">
            {/* Left: Office Information & Helplines */}
            <div>
              <div className="section-badge">
                📍 {lang === "mr" ? "संपर्क केंद्र" : "Office & Helplines"}
              </div>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1.25rem"
              }}>
                {lang === "mr" ? "राज्य मुख्य कार्यालय व संपर्क" : "State Central Office & Assistance"}
              </h2>

              <p style={{
                fontSize: "1.05rem",
                color: "var(--text-muted)",
                lineHeight: 1.75,
                marginBottom: "2rem"
              }}>
                {lang === "mr"
                  ? "लायन ग्रुप महाराष्ट्र राज्याशी आपण थेट दूरध्वनी, ईमेल किंवा प्रत्यक्ष भेट देऊन संपर्क साधू शकता."
                  : "Reach out to Lion Group Maharashtra through direct phone, emergency helpline, email, or visit our central headquarters."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Office Address */}
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1.25rem",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <MapPin size={22} color="var(--primary-gold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {t.contact.officeTitle}
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      {address}
                    </div>
                  </div>
                </div>

                {/* Blood Helpline Card */}
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1.25rem",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1.5px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-lg)"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#EF4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#FFFFFF"
                  }}>
                    <Heart size={22} fill="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#DC2626", fontWeight: 700 }}>
                      {t.contact.bloodTitle}
                    </div>
                    <a
                      href={`tel:${contactInfo?.emergencyBloodHelpline || "+919822099999"}`}
                      style={{ fontSize: "1.25rem", fontWeight: 800, color: "#991B1B", textDecoration: "none", display: "block", marginTop: "0.25rem" }}
                    >
                      {contactInfo?.emergencyBloodHelpline || "+91 98220 99999"}
                    </a>
                  </div>
                </div>

                {/* Phone & Email Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{
                    padding: "1.25rem",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center"
                  }}>
                    <Phone size={20} color="var(--primary-gold-dark)" />
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.contact.phoneTitle}</div>
                      <a href={`tel:${contactInfo?.primaryPhone}`} style={{ color: "var(--text-main)", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
                        {contactInfo?.primaryPhone || "+91 98220 12345"}
                      </a>
                    </div>
                  </div>

                  <div style={{
                    padding: "1.25rem",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center"
                  }}>
                    <Mail size={20} color="var(--primary-gold-dark)" />
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.contact.emailTitle}</div>
                      <a href={`mailto:${contactInfo?.primaryEmail}`} style={{ color: "var(--text-main)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                        {contactInfo?.primaryEmail || "contact@liongroup.org"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Inquiry Form */}
            <div>
              <div style={{
                background: "#FFFFFF",
                border: "2px solid rgba(212, 175, 55, 0.35)",
                borderRadius: "var(--radius-xl)",
                padding: "2.5rem",
                boxShadow: "var(--shadow-xl)"
              }}>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginBottom: "0.5rem"
                }}>
                  {t.contact.formTitle}
                </h3>
                <p style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  marginBottom: "1.75rem"
                }}>
                  {t.contact.formSubtitle}
                </p>

                {/* Success Message */}
                {submitSuccess && (
                  <div style={{
                    padding: "1.25rem",
                    backgroundColor: "#ECFDF5",
                    border: "1.5px solid #6EE7B7",
                    borderRadius: "var(--radius-md)",
                    color: "#065F46",
                    marginBottom: "1.5rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start"
                  }}>
                    <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {t.contact.successMessage}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {formErrors.length > 0 && (
                  <div style={{
                    padding: "1rem",
                    backgroundColor: "#FEF2F2",
                    border: "1.5px solid #FCA5A5",
                    borderRadius: "var(--radius-md)",
                    color: "#991B1B",
                    marginBottom: "1.5rem"
                  }}>
                    {formErrors.map((err, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.9rem" }}>
                        <AlertCircle size={16} />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">{t.contact.fullName} *</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder={lang === "mr" ? "उदा. राहुल शिंदे" : "e.g. Rahul Shinde"}
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.contact.mobileNumber} *</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        className="form-control"
                        placeholder="98XXXXXXXX"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">{t.contact.email}</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.contact.district}</label>
                      <select
                        name="district"
                        className="form-control"
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">{lang === "mr" ? "जिल्हा निवडा" : "Select District"}</option>
                        {MAHARASHTRA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contact.subject} *</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder={lang === "mr" ? "उदा. रक्तदान शिबिर आयोजन / माहिती" : "e.g. Blood Donation Camp Coordination"}
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contact.message} *</label>
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder={lang === "mr" ? "आपला संदेश सविस्तर लिहा..." : "Write your message details..."}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold"
                    style={{ width: "100%", padding: "0.85rem", fontSize: "1.05rem" }}
                    disabled={submitting}
                  >
                    <Send size={18} />
                    <span>{submitting ? t.contact.sending : t.contact.sendButton}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .contact-grid {
              grid-template-columns: 0.9fr 1.1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
