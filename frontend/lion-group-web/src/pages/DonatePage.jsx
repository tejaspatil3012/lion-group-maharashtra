import React, { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { donationService } from "../services/donationService";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getImageUrl } from "../services/api";
import { 
  Heart, 
  Target, 
  Users, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  ArrowRight, 
  Download, 
  Printer, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Award,
  Filter,
  Clock,
  XCircle
} from "lucide-react";

export const DonatePage = () => {
  const { lang, t } = useLanguage();

  const [campaigns, setCampaigns] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donorCampaignFilter, setDonorCampaignFilter] = useState("all");

  // Donation Modal State
  const [selectedCampaign, setSelectedCampaign] = useState(null); // null = General Fund
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Form & Amount, 2: UPI QR & UTR, 3: Success Receipt

  // Form State
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [city, setCity] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const orgUpiId = "9370078254@ybl"; // Official UPI ID
  const orgName = "LION GROUP MAHARASHTRA RAJYA";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, donorsData] = await Promise.all([
        donationService.getActiveCampaigns(),
        donationService.getRecentDonors(50)
      ]);
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      setRecentDonors(Array.isArray(donorsData) ? donorsData : []);
    } catch (err) {
      console.error("Failed to load donation data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openDonationModal = (campaign = null) => {
    setSelectedCampaign(campaign);
    setStep(1);
    setModalOpen(true);
  };

  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val && parseInt(val, 10) > 0) {
      setAmount(parseInt(val, 10));
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(orgUpiId)}&pn=${encodeURIComponent(orgName)}&am=${finalAmount}&tn=${encodeURIComponent(selectedCampaign ? selectedCampaign.titleEnglish : "General Social Donation")}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiDeepLink)}`;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorMobile.trim() || finalAmount < 10) {
      alert(lang === "mr" ? "कृपया सर्व आवश्यक माहिती आणि योग्य रक्कम भरा." : "Please fill in all required details and a valid amount.");
      return;
    }
    setStep(2);
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert(lang === "mr" ? "कृपया 12 अंकी UTR / Reference नंबर प्रविष्ट करा." : "Please enter the 12-digit UTR / Reference number.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        campaignId: selectedCampaign ? selectedCampaign.id : null,
        donorName: donorName.trim(),
        donorMobile: donorMobile.trim(),
        donorEmail: donorEmail.trim() || null,
        donorPanNumber: donorPan.trim().toUpperCase() || null,
        city: city.trim() || null,
        amount: finalAmount,
        paymentMethod: "UPI",
        utrNumber: utrNumber.trim(),
        isAnonymous
      };

      const result = await donationService.submitDonation(payload);
      setCreatedReceipt(result);
      setStep(3);
      loadData(); // refresh counts
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit donation. Please check details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(orgUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePrintReceipt = () => {
    const receiptEl = document.getElementById("printable-receipt");
    if (!receiptEl) return;

    const existingFrame = document.getElementById("receipt-print-frame");
    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement("iframe");
    printFrame.id = "receipt-print-frame";
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Donation_Receipt_${createdReceipt?.receiptNumber || "LGM"}</title>
          <style>
            :root {
              --primary-gold-dark: #B8860B;
              --primary-gold: #D4AF37;
            }
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: #ffffff;
              color: #0F172A;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .receipt-print-wrapper {
              width: 100%;
              max-width: 580px;
              margin: 15px auto;
            }
          </style>
        </head>
        <body>
          <div class="receipt-print-wrapper">
            ${receiptEl.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        printFrame.remove();
      }, 1000);
    }, 250);
  };

  return (
    <div>
      <PageHeader
        badge={lang === "mr" ? "लोककल्याण व समाजहित" : "Social Welfare"}
        title={lang === "mr" ? "समाजसेवेसाठी आपले योगदान (देणगी)" : "Support Our Social Causes"}
        subtitle={
          lang === "mr"
            ? "आपण दिलेला प्रत्येक रुपया महाराष्ट्रातील रुग्णवाहिका, मोफत औषधोपचार व गरजू विद्यार्थ्यांच्या शिक्षणासाठी वापरला जातो."
            : "Every rupee you donate powers emergency medical care, free education kits, and community upliftment across Maharashtra."
        }
        breadcrumb={[{ label: lang === "mr" ? "देणगी" : "Donate" }]}
      />

      <section className="section" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          
          {/* Main Action Banner: General Fund */}
          <div style={{
            background: "linear-gradient(135deg, #070D1E 0%, #0E1A33 100%)",
            border: "1.5px solid var(--border-gold)",
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "3.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "var(--primary-gold)",
              padding: "0.35rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1rem"
            }}>
              <Sparkles size={16} />
              {lang === "mr" ? "सर्वसाधारण समाजकार्य निधी" : "General Social Welfare Fund"}
            </div>

            <h2 style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontFamily: "var(--font-heading)",
              color: "#FFFFFF",
              marginBottom: "1rem",
              maxWidth: "800px"
            }}>
              {lang === "mr"
                ? "लायन ग्रुप महाराष्ट्र राज्याच्या सेवाकार्यात हातभार लावा"
                : "Empower Communities with Lion Group Maharashtra Rajya"}
            </h2>

            <p style={{
              color: "#CBD5E1",
              fontSize: "1.05rem",
              maxWidth: "680px",
              marginBottom: "2rem",
              lineHeight: 1.65
            }}>
              {lang === "mr"
                ? "आपण कोणत्याही विशिष्ट मोहिमेसाठी किंवा संस्थेच्या सर्वसमावेशक समाजोपयोगी कामासाठी थेट UPI द्वारे देणगी देऊ शकता. देणगीची त्वरित अधिकृत पावती मिळेल."
                : "Contribute directly to our emergency relief corpus or any active campaign via UPI QR Code. Instant branded digital receipt provided."}
            </p>

            <button
              type="button"
              onClick={() => openDonationModal(null)}
              className="btn btn-gold"
              style={{
                fontSize: "1.05rem",
                padding: "0.85rem 2.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                boxShadow: "0 10px 25px rgba(212, 175, 55, 0.35)",
                fontWeight: 700
              }}
            >
              <Heart size={20} fill="#070D1E" />
              {lang === "mr" ? "आत्ताच देणगी द्या (Donate Now)" : "Donate to General Fund"}
            </button>
          </div>

          {/* Active Campaigns Section */}
          <div style={{ marginBottom: "3.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                <Target size={14} style={{ marginRight: "0.35rem" }} />
                {lang === "mr" ? "सक्रिय निधी मोहीम" : "Active Initiatives"}
              </span>
              <h2 style={{ fontSize: "2rem", color: "#0F172A", fontFamily: "var(--font-heading)" }}>
                {lang === "mr" ? "सध्या सुरू असलेले विशेष उपक्रम" : "Special Fundraising Campaigns"}
              </h2>
            </div>

            {loading ? (
              <LoadingSpinner message={lang === "mr" ? "मोहिमा लोड होत आहेत..." : "Loading Campaigns..."} />
            ) : campaigns.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#FFFFFF", borderRadius: "var(--radius-lg)" }}>
                <p style={{ color: "#64748B" }}>
                  {lang === "mr" ? "सध्या कोणतीही विशेष मोहीम सुरू नाही. आपण सर्वसाधारण निधीसाठी देणगी देऊ शकता." : "No specific campaigns at the moment. You can still donate to the General Fund."}
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "2rem"
              }}>
                {campaigns.map((camp) => {
                  const title = lang === "mr" ? camp.titleMarathi : camp.titleEnglish;
                  const summary = lang === "mr" ? camp.summaryMarathi : camp.summaryEnglish;
                  const percentage = camp.progressPercentage || 0;

                  return (
                    <div
                      key={camp.id}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "var(--radius-xl)",
                        overflow: "hidden",
                        border: "1.5px solid #E2E8F0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {/* Banner Image */}
                      <div style={{ position: "relative", height: "220px", overflow: "hidden", backgroundColor: "#0E1A33" }}>
                        <img
                          src={getImageUrl(camp.bannerImageUrl) || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"}
                          alt={title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: "0.75rem",
                          right: "0.75rem",
                          background: "rgba(7, 13, 30, 0.85)",
                          color: "#FFFFFF",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backdropFilter: "blur(4px)"
                        }}>
                          <Users size={12} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} />
                          {camp.donorsCount || 0} {lang === "mr" ? "देणगीदार" : "Donors"}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "#0F172A",
                          marginBottom: "0.75rem",
                          fontFamily: "var(--font-heading)",
                          lineHeight: 1.3
                        }}>
                          {title}
                        </h3>

                        <p style={{
                          fontSize: "0.925rem",
                          color: "#475569",
                          marginBottom: "1.5rem",
                          lineHeight: 1.6,
                          flex: 1
                        }}>
                          {summary}
                        </p>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: "1.25rem" }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            marginBottom: "0.5rem"
                          }}>
                            <span style={{ fontWeight: 700, color: "var(--primary-gold-dark)" }}>
                              ₹{Number(camp.raisedAmount || 0).toLocaleString("en-IN")} {lang === "mr" ? "जमा" : "raised"}
                            </span>
                            <span style={{ color: "#64748B", fontWeight: 600 }}>
                              {lang === "mr" ? "लक्ष्य:" : "Goal:"} ₹{Number(camp.targetAmount || 0).toLocaleString("en-IN")} ({percentage}%)
                            </span>
                          </div>

                          <div style={{
                            width: "100%",
                            height: "10px",
                            backgroundColor: "#E2E8F0",
                            borderRadius: "var(--radius-full)",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${Math.min(100, percentage)}%`,
                              height: "100%",
                              background: "linear-gradient(90deg, #F5C542 0%, #D4AF37 100%)",
                              borderRadius: "var(--radius-full)",
                              transition: "width 0.6s ease"
                            }} />
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          type="button"
                          onClick={() => openDonationModal(camp)}
                          className="btn btn-gold"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            fontWeight: 700
                          }}
                        >
                          <Heart size={16} fill="#070D1E" />
                          {lang === "mr" ? "या मोहिमेस देणगी द्या" : "Donate to this Cause"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Honor Roll / Public Donation Ledger with Campaign Filter */}
          {recentDonors.length > 0 && (() => {
            const filteredDonors = recentDonors
              .filter((d) => d.paymentStatus === "Approved")
              .filter((d) => {
                if (donorCampaignFilter === "all") return true;
                if (donorCampaignFilter === "general") return !d.campaignId;
                return d.campaignId === parseInt(donorCampaignFilter, 10);
              });

            return (
              <div style={{
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
              }}>
                {/* Header with Title and Campaign Filter Dropdown */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "var(--radius-lg)",
                      background: "rgba(212, 175, 55, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary-gold-dark)"
                    }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0, fontFamily: "var(--font-heading)" }}>
                        {lang === "mr" ? "कृतज्ञता सूची / सन्माननीय देणगीदार" : "Public Donation Ledger & Donors"}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0.15rem 0 0 0" }}>
                        {lang === "mr" ? "समाजाच्या कल्याणासाठी हातभार लावणारे दानशूर व्यक्ती" : "Public record of contributions received for social initiatives"}
                      </p>
                    </div>
                  </div>

                  {/* Campaign Filter */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#475569", fontSize: "0.875rem", fontWeight: 700 }}>
                      <Filter size={15} color="var(--primary-gold-dark)" />
                      {lang === "mr" ? "मोहीम निवडा:" : "Filter Cause:"}
                    </span>
                    <select
                      value={donorCampaignFilter}
                      onChange={(e) => setDonorCampaignFilter(e.target.value)}
                      style={{
                        padding: "0.5rem 0.85rem",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid #CBD5E1",
                        background: "#F8FAFC",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#0F172A",
                        outline: "none",
                        cursor: "pointer",
                        minWidth: "220px",
                        maxWidth: "320px"
                      }}
                    >
                      <option value="all">
                        {lang === "mr" ? "सर्व उपक्रम / मोहिमा (All Causes)" : "All Campaigns & Causes"}
                      </option>
                      <option value="general">
                        {lang === "mr" ? "सर्वसाधारण समाजकार्य निधी (General Fund)" : "General Social Relief Fund"}
                      </option>
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {lang === "mr" ? c.titleMarathi : c.titleEnglish}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table */}
                {filteredDonors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#F8FAFC", borderRadius: "var(--radius-lg)" }}>
                    <p style={{ color: "#64748B", fontSize: "0.95rem", margin: 0 }}>
                      {lang === "mr"
                        ? "निवडलेल्या मोहिमेसाठी अद्याप कोणतीही देणगी नोंद उपलब्ध नाही."
                        : "No donation records found for the selected campaign."}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    overflowX: "auto",
                    maxHeight: "440px",
                    overflowY: "auto",
                    border: "1px solid #E2E8F0",
                    borderRadius: "var(--radius-lg)"
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                      <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
                        <tr style={{ background: "#F1F5F9", borderBottom: "1.5px solid #CBD5E1", color: "#334155" }}>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {lang === "mr" ? "पावती व दिनांक (Receipt & Date)" : "Receipt & Date"}
                          </th>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {lang === "mr" ? "देणगीदार तपशील (Donor Details)" : "Donor Details"}
                          </th>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {lang === "mr" ? "मोहीम / उद्देश (Cause / Campaign)" : "Cause / Campaign"}
                          </th>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {lang === "mr" ? "रक्कम (Amount)" : "Amount (₹)"}
                          </th>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {lang === "mr" ? "माध्यम व UTR (Method & UTR)" : "Method & UTR"}
                          </th>
                          <th style={{ padding: "0.85rem 1rem", fontWeight: 700, textAlign: "center" }}>
                            {lang === "mr" ? "स्थिती (Status)" : "Status"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonors.map((d, index) => {
                          const isEven = index % 2 === 0;
                          const causeTitle = lang === "mr"
                            ? (d.campaignTitleMarathi || d.campaignTitleEnglish || "सर्वसाधारण समाजकार्य निधी")
                            : (d.campaignTitleEnglish || "General Social Welfare Corpus");

                          return (
                            <tr
                              key={d.id}
                              style={{
                                background: isEven ? "#FFFFFF" : "#F8FAFC",
                                borderBottom: "1px solid #E2E8F0"
                              }}
                            >
                              {/* Receipt & Date */}
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 800, color: "var(--primary-gold-dark)", fontFamily: "monospace", fontSize: "0.85rem" }}>
                                  {d.receiptNumber || "N/A"}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.15rem" }}>
                                  {new Date(d.donatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </div>
                              </td>

                              {/* Donor Details */}
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.925rem" }}>
                                  {d.donorName}
                                  {d.isAnonymous && (
                                    <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginLeft: "0.35rem" }}>
                                      ({lang === "mr" ? "गुप्त देणगी" : "Anonymous"})
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: "0.775rem", color: "#64748B" }}>
                                  {d.city || (lang === "mr" ? "महाराष्ट्र" : "Maharashtra")}
                                </div>
                              </td>

                              {/* Cause / Campaign */}
                              <td style={{ padding: "0.85rem 1rem", maxWidth: "240px" }}>
                                <div style={{ color: "#1E293B", fontWeight: 600, lineHeight: 1.4 }}>
                                  {causeTitle}
                                </div>
                              </td>

                              {/* Amount */}
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--primary-gold-dark)" }}>
                                  ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                                </div>
                              </td>

                              {/* Method & UTR */}
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 600, color: "#334155" }}>
                                  {d.paymentMethod || "UPI"}
                                </div>
                                {d.utrNumber && (
                                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace", marginTop: "0.1rem" }}>
                                    UTR: {d.utrNumber}
                                  </div>
                                )}
                              </td>

                              {/* Status */}
                              <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                                <span className={`badge ${
                                  d.paymentStatus === "Approved" ? "badge-tree" : d.paymentStatus === "Pending" ? "badge-gold" : "badge-blood"
                                }`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}>
                                  {d.paymentStatus === "Approved" && <CheckCircle2 size={12} />}
                                  {d.paymentStatus === "Pending" && <Clock size={12} />}
                                  {d.paymentStatus === "Rejected" && <XCircle size={12} />}
                                  <span>
                                    {d.paymentStatus === "Approved"
                                      ? (lang === "mr" ? "मान्यताप्राप्त" : "Approved")
                                      : d.paymentStatus === "Pending"
                                      ? (lang === "mr" ? "पडताळणी सुरू" : "Pending")
                                      : (lang === "mr" ? "नाकारलेले" : "Rejected")}
                                  </span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

        </div>
      </section>

      {/* Interactive Multi-step Donation Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(5, 9, 20, 0.8)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          zIndex: 1000,
          overflowY: "auto"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "var(--radius-2xl)",
            maxWidth: step === 3 ? "600px" : "540px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            overflow: "hidden",
            position: "relative",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column"
          }}>
            
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, #070D1E 0%, #0E1A33 100%)",
              color: "#FFFFFF",
              padding: "1.25rem 1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-gold)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--gradient-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#070D1E",
                  fontWeight: 900
                }}>
                  🦁
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    {step === 3 
                      ? (lang === "mr" ? "अधिकृत देणगी पावती" : "Official Donation Receipt")
                      : (selectedCampaign ? (lang === "mr" ? selectedCampaign.titleMarathi : selectedCampaign.titleEnglish) : (lang === "mr" ? "लायन ग्रुप समाजकार्य निधी" : "General Social Relief Fund"))
                    }
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--primary-gold)" }}>
                    {step === 1 ? "Step 1 of 2: Details" : step === 2 ? "Step 2 of 2: UPI Payment" : "Completed"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.75rem", overflowY: "auto", flex: 1 }}>

              {/* STEP 1: Select Amount & Donor Information */}
              {step === 1 && (
                <form onSubmit={handleProceedToPayment}>
                  {/* Amount Pills */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>
                      {lang === "mr" ? "देणगी रक्कम निवडा (Choose Amount) *" : "Select Donation Amount *"}
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      {[500, 1000, 2100, 5000, 11000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAmountSelect(val)}
                          style={{
                            padding: "0.65rem 0.5rem",
                            borderRadius: "var(--radius-md)",
                            border: (!customAmount && amount === val) ? "2px solid var(--primary-gold)" : "1.5px solid #E2E8F0",
                            background: (!customAmount && amount === val) ? "#070D1E" : "#FFFFFF",
                            color: (!customAmount && amount === val) ? "var(--primary-gold)" : "#1E293B",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          ₹{val.toLocaleString("en-IN")}
                        </button>
                      ))}

                      <input
                        type="text"
                        placeholder={lang === "mr" ? "इतर रक्कम ₹" : "Other ₹"}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "var(--radius-md)",
                          border: customAmount ? "2px solid var(--primary-gold)" : "1.5px solid #E2E8F0",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          textAlign: "center",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  {/* Donor Details */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                        {lang === "mr" ? "पूर्ण नाव *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="e.g. Rahul Patil"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                        {lang === "mr" ? "मोबाईल नंबर *" : "Mobile Number *"}
                      </label>
                      <input
                        type="tel"
                        required
                        className="input-field"
                        placeholder="+91 9876543210"
                        value={donorMobile}
                        onChange={(e) => setDonorMobile(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                        {lang === "mr" ? "ईमेल (पर्यायी)" : "Email (Optional)"}
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="rahul@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                        {lang === "mr" ? "शहर / जिल्हा" : "City / District"}
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Jalgaon / Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      {lang === "mr" ? "पॅन कार्ड नंबर (पावतीसाठी पर्यायी)" : "PAN Number (Optional for Tax Receipt)"}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Anonymous Checkbox */}
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    fontSize: "0.875rem",
                    color: "#475569",
                    cursor: "pointer",
                    marginBottom: "1.75rem"
                  }}>
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span>{lang === "mr" ? "माझे नाव सार्वजनिक यादीत दाखवू नका (गुप्त दान)" : "Make my contribution anonymous on the public supporters wall"}</span>
                  </label>

                  <button
                    type="submit"
                    className="btn btn-gold"
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>{lang === "mr" ? `₹${finalAmount} पेमेंटसाठी पुढे जा` : `Proceed to Pay ₹${finalAmount}`}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {/* STEP 2: UPI QR & UTR Confirmation */}
              {step === 2 && (
                <form onSubmit={handleSubmitDonation}>
                  <div style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                    textAlign: "center",
                    marginBottom: "1.5rem"
                  }}>
                    <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.25rem" }}>
                      {lang === "mr" ? "भरणा करायची रक्कम" : "Amount to Pay"}
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary-gold-dark)", marginBottom: "1rem" }}>
                      ₹{Number(finalAmount || 0).toLocaleString("en-IN")}
                    </div>

                    {/* QR Code */}
                    <div style={{
                      background: "#FFFFFF",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-lg)",
                      display: "inline-block",
                      border: "1.5px solid #CBD5E1",
                      boxShadow: "var(--shadow-sm)",
                      marginBottom: "1rem"
                    }}>
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code"
                        style={{ width: "200px", height: "200px", display: "block" }}
                      />
                    </div>

                    <div style={{ fontSize: "0.825rem", color: "#475569", marginBottom: "0.75rem" }}>
                      {lang === "mr"
                        ? "PhonePe, Google Pay, Paytm, BHIM द्वारे QR स्कॅन करा"
                        : "Scan with PhonePe, Google Pay, Paytm or any UPI App"}
                    </div>

                    {/* UPI ID Copy Box */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: "var(--radius-md)",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#1E293B"
                    }}>
                      <span>{orgUpiId}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-gold-dark)", display: "flex" }}
                        title="Copy UPI ID"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    {copiedUpi && (
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#16A34A", marginTop: "0.25rem", fontWeight: 600 }}>
                        {lang === "mr" ? "UPI आयडी कॉपी झाला!" : "UPI ID Copied!"}
                      </span>
                    )}

                    {/* Mobile UPI Deep link Button */}
                    <div style={{ marginTop: "1rem" }}>
                      <a
                        href={upiDeepLink}
                        className="btn btn-outline-gold"
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.5rem 1rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <ExternalLink size={14} />
                        {lang === "mr" ? "मोबाईल UPI ॲपने थेट पैसे भरा" : "Open in UPI App (PhonePe / GPay)"}
                      </a>
                    </div>
                  </div>

                  {/* UTR Input */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.35rem" }}>
                      {lang === "mr" ? "12 अंकी UTR / Transaction Reference नंबर *" : "12-digit UPI UTR / Reference No. *"}
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="उदा. 423589123456"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
                      style={{ fontSize: "1rem", letterSpacing: "0.05em", fontWeight: 700 }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem", display: "block" }}>
                      {lang === "mr" 
                        ? "पैसे पाठवल्यावर आपल्या Google Pay / PhonePe हिस्ट्रीमध्ये दिसणारा १२ अंकी UTR नंबर येथे टाका."
                        : "Find the 12-digit UTR in your payment app transaction details and enter it here."}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      disabled={submitting}
                    >
                      {lang === "mr" ? "मागे" : "Back"}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-gold"
                      style={{ flex: 2, fontWeight: 700 }}
                      disabled={submitting}
                    >
                      {submitting ? (lang === "mr" ? "नोंदणी होत आहे..." : "Submitting...") : (lang === "mr" ? "देणगी पुष्टी करा व पावती मिळवा" : "Confirm Donation & Get Receipt")}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Official Printable Receipt */}
              {step === 3 && createdReceipt && (
                <div>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(22, 163, 74, 0.15)",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 0.75rem auto"
                    }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: "0 0 0.25rem 0" }}>
                      {lang === "mr" ? "आपल्या बहुमोल देणगीबद्दल मनःपूर्वक धन्यवाद!" : "Thank You for Your Generous Contribution!"}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#64748B", margin: 0 }}>
                      {lang === "mr" ? "आपली देणगी यशस्वीरीत्या नोंदवली गेली आहे." : "Your donation record has been successfully registered."}
                    </p>
                  </div>

                  {/* Printable Receipt Card */}
                  <div 
                    id="printable-receipt"
                    style={{
                      background: "#FFFFFF",
                      border: "2px dashed #CBD5E1",
                      borderRadius: "var(--radius-xl)",
                      padding: "1.75rem",
                      marginBottom: "1.5rem"
                    }}
                  >
                    {/* Receipt Header */}
                    <div style={{ textAlign: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "1rem", marginBottom: "1rem" }}>
                      <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#070D1E", letterSpacing: "0.02em" }}>
                        🦁 LION GROUP MAHARASHTRA RAJYA
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-gold-dark)", fontWeight: 700 }}>
                        महाराष्ट्र राज्य (रजि.) • अधिकृत देणगी पावती
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem" }}>
                        Receipt No: <strong style={{ color: "#0F172A" }}>{createdReceipt.receiptNumber}</strong>
                      </div>
                    </div>

                    {/* Receipt Fields */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
                      <div>
                        <span style={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>Donor Name:</span>
                        <strong style={{ color: "#0F172A" }}>{createdReceipt.donorName}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>Date:</span>
                        <strong style={{ color: "#0F172A" }}>{new Date(createdReceipt.donatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>Mobile Number:</span>
                        <strong style={{ color: "#0F172A" }}>{createdReceipt.donorMobile}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>UTR / Reference:</span>
                        <strong style={{ color: "#0F172A" }}>{createdReceipt.utrNumber || "N/A"}</strong>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <span style={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>Cause / Purpose:</span>
                        <strong style={{ color: "#0F172A" }}>{createdReceipt.campaignTitleEnglish || "General Social Welfare Corpus"}</strong>
                      </div>
                    </div>

                    {/* Amount Block */}
                    <div style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "var(--radius-lg)",
                      padding: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontWeight: 700, color: "#334155" }}>Amount Received:</span>
                      <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--primary-gold-dark)" }}>
                        ₹{Number(createdReceipt?.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Stamp note */}
                    <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.7rem", color: "#94A3B8" }}>
                      This is a computer-generated receipt issued by Lion Group Maharashtra Rajya.
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={handlePrintReceipt}
                      className="btn btn-outline-gold"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                    >
                      <Printer size={16} />
                      {lang === "mr" ? "पावती प्रिंट करा" : "Print Receipt"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="btn btn-gold"
                      style={{ flex: 1, fontWeight: 700 }}
                    >
                      {lang === "mr" ? "पूर्ण झाले (Close)" : "Done"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
