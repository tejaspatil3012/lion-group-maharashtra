import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { membershipService } from "../services/membershipService";
import { uploadService } from "../services/uploadService";
import { MAHARASHTRA_DISTRICTS } from "../utils/constants";
import api, { getImageUrl } from "../services/api";
import {
  UserPlus,
  CheckCircle,
  UploadCloud,
  Loader2,
  Shield,
  Heart,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
  Check
} from "lucide-react";

export const JoinPage = () => {
  const { lang } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullNameEnglish: "",
    fullNameMarathi: "",
    mobileNumber: "",
    email: "",
    district: "",
    taluka: "",
    villageOrCity: "",
    photoUrl: "",
    occupation: "",
    message: ""
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadService.uploadImage(file);
      const url = res?.url || (typeof res === "string" ? res : res?.data?.url);
      if (url) {
        setFormData((prev) => ({ ...prev, photoUrl: url }));
      }
    } catch (err) {
      alert(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullNameEnglish.trim() || !formData.fullNameMarathi.trim()) {
      setErrorMessage(lang === "mr" ? "कृपया पूर्ण नाव इंग्रजी व मराठीत प्रविष्ट करा." : "Please enter full name in English and Marathi.");
      return;
    }

    if (!formData.mobileNumber.trim()) {
      setErrorMessage(lang === "mr" ? "कृपया मोबाईल नंबर प्रविष्ट करा." : "Please enter your mobile number.");
      return;
    }

    if (!formData.district) {
      setErrorMessage(lang === "mr" ? "कृपया जिल्हा निवडा." : "Please select your district.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await membershipService.submitApplication(formData);
      const appResult = result || formData;
      setSubmittedApp(appResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || (lang === "mr" ? "अर्ज सादर करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा." : "Failed to submit application. Please try again.");
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#060B18", minHeight: "100vh", color: "#E2E8F0", paddingBottom: "5rem" }}>
      {/* Hero Banner */}
      <section style={{
        background: "linear-gradient(180deg, #09132A 0%, #060B18 100%)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        padding: "4rem 0 3rem 0",
        textAlign: "center"
      }}>
        <div className="container">
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "rgba(212, 175, 55, 0.12)",
            border: "1px solid var(--border-gold)",
            color: "var(--primary-gold)",
            fontSize: "0.85rem",
            fontWeight: 700,
            marginBottom: "1rem"
          }}>
            <Sparkles size={15} />
            <span>{lang === "mr" ? "महाराष्ट्राची अग्रगण्य सामाजिक संस्था" : "Join Maharashtra's Leading Social Force"}</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.2,
            marginBottom: "1rem"
          }}>
            {lang === "mr" ? "लायन ग्रुपचे अधिकृत सदस्य व्हा" : "Be A Lion Group Member"}
          </h1>

          <p style={{
            color: "var(--text-light-muted)",
            fontSize: "1.1rem",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {lang === "mr"
              ? "समाजसेवा, पर्यावरण संवर्धन, रक्तदान शिबिरे आणि लोककल्याणाच्या कार्यात सहभागी होऊन महाराष्ट्राच्या विकासात आपले योगदान द्या."
              : "Step forward to serve the community through blood drives, tree plantations, disaster relief, and youth empowerment across Maharashtra."}
          </p>
        </div>
      </section>

      {/* Main Registration Form Container */}
      <div className="container" style={{ maxWidth: "850px", marginTop: "2.5rem" }}>
        {submittedApp ? (
          /* Submission Success State */
          <div id="submission-result-box" style={{
            background: "linear-gradient(135deg, rgba(16, 28, 54, 0.9) 0%, rgba(8, 14, 30, 0.95) 100%)",
            border: "2px solid var(--primary-gold)",
            borderRadius: "16px",
            padding: "3.5rem 2.5rem",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "2px solid #10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              color: "#10B981"
            }}>
              <CheckCircle size={44} />
            </div>

            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.85rem",
              color: "#FFFFFF",
              fontWeight: 800,
              marginBottom: "0.75rem"
            }}>
              {lang === "mr" ? "सदस्यता अर्ज यशस्वीपणे प्राप्त झाला!" : "Membership Application Submitted!"}
            </h2>

            <p style={{ color: "#94A3B8", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 2rem auto" }}>
              {lang === "mr"
                ? `धन्यवाद ${submittedApp.fullNameMarathi || submittedApp.fullNameEnglish}! आपला अर्ज लायन ग्रुप महाराष्ट्र राज्य मध्यवर्ती समितीकडे मंजुरीसाठी पाठवण्यात आला आहे.`
                : `Thank you, ${submittedApp.fullNameEnglish}! Your application has been submitted to the Lion Group Central Review Committee for verification.`}
            </p>

            {/* Application Summary Card */}
            <div style={{
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              border: "1px dashed var(--primary-gold)",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "500px",
              margin: "0 auto 2.5rem auto",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                {submittedApp.photoUrl && (
                  <img
                    src={getImageUrl(submittedApp.photoUrl)}
                    alt="Applicant"
                    style={{ width: "65px", height: "65px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary-gold)" }}
                  />
                )}
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF" }}>
                    {submittedApp.fullNameMarathi || submittedApp.fullNameEnglish}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--primary-gold)", marginTop: "0.2rem" }}>
                    📍 {submittedApp.district} {submittedApp.taluka ? `• ${submittedApp.taluka}` : ""}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                    📞 {submittedApp.mobileNumber}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(212, 175, 55, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Application Status:</span>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#F59E0B",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  border: "1px solid rgba(245, 158, 11, 0.3)"
                }}>
                  ⏳ Under Review (पडताळणी सुरू आहे)
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/members" className="btn btn-gold" style={{ padding: "0.75rem 1.75rem" }}>
                <span>{lang === "mr" ? "सध्याचे सदस्य पहा" : "View Active Members"}</span>
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => {
                  setSubmittedApp(null);
                  setFormData({
                    fullNameEnglish: "",
                    fullNameMarathi: "",
                    mobileNumber: "",
                    email: "",
                    district: "",
                    taluka: "",
                    villageOrCity: "",
                    photoUrl: "",
                    occupation: "",
                    message: ""
                  });
                }}
                className="btn btn-outline-gold"
                style={{ padding: "0.75rem 1.5rem" }}
              >
                <span>{lang === "mr" ? "दुसरा अर्ज भरा" : "Submit Another Application"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div style={{
            background: "linear-gradient(135deg, rgba(14, 25, 48, 0.8) 0%, rgba(7, 13, 28, 0.95) 100%)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            borderRadius: "16px",
            padding: "2.5rem",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "1rem" }}>
              <UserPlus size={24} color="var(--primary-gold)" />
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", color: "#FFFFFF", fontWeight: 700 }}>
                  {lang === "mr" ? "सदस्यता अर्ज (Membership Registration Form)" : "Membership Registration Form"}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-light-muted)" }}>
                  {lang === "mr" ? "कृपया खालील सर्व माहिती काळजीपूर्वक भरा." : "Please fill out all required details accurately."}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1.25rem",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "var(--radius-md)",
                color: "#FCA5A5",
                marginBottom: "1.5rem",
                fontSize: "0.925rem"
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Profile Photo Uploader */}
              <div style={{ marginBottom: "2rem", padding: "1.25rem", backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: "12px", border: "1px dashed rgba(212, 175, 55, 0.3)" }}>
                <label style={{ display: "block", color: "var(--primary-gold)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                  📷 {lang === "mr" ? "सदस्य प्रोफाईल फोटो (Profile Photo)" : "Profile Photo (Optional)"}
                </label>

                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{
                    width: "85px",
                    height: "85px",
                    borderRadius: "50%",
                    backgroundColor: "#070D1E",
                    border: "2.5px solid var(--primary-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: "0 0 15px rgba(212, 175, 55, 0.25)"
                  }}>
                    {formData.photoUrl ? (
                      <img
                        src={getImageUrl(formData.photoUrl)}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/uploads/king.jpeg";
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "2.2rem", color: "#64748B" }}>👤</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.55rem 1.25rem",
                          backgroundColor: "rgba(212, 175, 55, 0.15)",
                          border: "1px solid var(--primary-gold)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--primary-gold)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          cursor: uploading ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {uploading ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
                        <span>
                          {uploading
                            ? (lang === "mr" ? "अपलोड होत आहे..." : "Uploading...")
                            : formData.photoUrl
                            ? (lang === "mr" ? "फोटो बदला" : "Change Photo")
                            : (lang === "mr" ? "फोटो निवडा व अपलोड करा" : "Upload Photo")}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          style={{ display: "none" }}
                        />
                      </label>

                      {formData.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photoUrl: "" }))}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.55rem 1rem",
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "var(--radius-md)",
                            color: "#EF4444",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            cursor: "pointer"
                          }}
                        >
                          <X size={15} />
                          <span>{lang === "mr" ? "फोटो काढा" : "Remove"}</span>
                        </button>
                      )}
                    </div>

                    {formData.photoUrl ? (
                      <span style={{ fontSize: "0.825rem", color: "#10B981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} />
                        <span>{lang === "mr" ? "फोटो यशस्वीपणे अपलोड झाला!" : "Photo uploaded successfully!"}</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                        {lang === "mr" ? "JPG, PNG किंवा WEBP फॉरमॅट (कमाल १० MB)" : "JPG, PNG or WEBP format (Max 10 MB)"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Names: English & Marathi */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "पूर्ण नाव (इंग्रजीत) *" : "Full Name (In English) *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Shankar Patil"
                    value={formData.fullNameEnglish}
                    onChange={(e) => setFormData({ ...formData, fullNameEnglish: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "पूर्ण नाव (मराठीत) *" : "Full Name (In Marathi) *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रमेश शंकर पाटील"
                    value={formData.fullNameMarathi}
                    onChange={(e) => setFormData({ ...formData, fullNameMarathi: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>
              </div>

              {/* Contact: Mobile & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "मोबाईल नंबर (WhatsApp) *" : "Mobile Number (WhatsApp) *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem 0.75rem 2.75rem",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "ईमेल पत्ता (ऐच्छिक)" : "Email Address (Optional)"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem 0.75rem 2.75rem",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(212, 175, 55, 0.2)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Location: District, Taluka, City/Village */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "जिल्हा (District) *" : "District *"}
                  </label>
                  <select
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#0B1528",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  >
                    <option value="">-- {lang === "mr" ? "जिल्हा निवडा" : "Select District"} --</option>
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "तालुका (Taluka)" : "Taluka"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. हवेली / यावल"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {lang === "mr" ? "गाव / शहर (Village / City)" : "Village / City"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. किनगाव / पुणे"
                    value={formData.villageOrCity}
                    onChange={(e) => setFormData({ ...formData, villageOrCity: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>
              </div>

              {/* Occupation & Reason for Joining */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  {lang === "mr" ? "व्यवसाय / शिक्षण (Occupation / Profession)" : "Occupation / Profession"}
                </label>
                <div style={{ position: "relative" }}>
                  <Briefcase size={16} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    placeholder="उदा. समाजसेवक / व्यवसाय / विद्यार्थी / शेतकरी"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  {lang === "mr" ? "लायन ग्रुपमध्ये सामील होण्याचे कारण / संदेश (Message)" : "Why do you want to join Lion Group? (Optional)"}
                </label>
                <div style={{ position: "relative" }}>
                  <MessageSquare size={16} color="var(--primary-gold)" style={{ position: "absolute", left: "1rem", top: "1rem" }} />
                  <textarea
                    rows={3}
                    placeholder={lang === "mr" ? "समाजासाठी आपण कशा प्रकारे योगदान देऊ इच्छिता ते थोडक्यात लिहा..." : "Share how you would like to contribute towards social service..."}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.95rem",
                      resize: "vertical"
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || uploading}
                className="btn btn-gold"
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  justifyContent: "center",
                  borderRadius: "10px",
                  boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)"
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    <span>{lang === "mr" ? "अर्ज सादर होत आहे..." : "Submitting Application..."}</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>{lang === "mr" ? "सदस्यता अर्ज सादर करा (Submit Application)" : "Submit Membership Application"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
