import React from "react";
import { getImageUrl } from "../../services/api";
import { useLanguage } from "../../hooks/useLanguage";
import { MapPin, Phone, Mail, Award, Calendar } from "lucide-react";

export const MemberCard = ({ member }) => {
  const { lang, t } = useLanguage();

  const fullName = lang === "mr" ? (member.fullNameMarathi || member.fullNameEnglish) : member.fullNameEnglish;
  const designation = lang === "mr" ? (member.designationMarathi || member.designationEnglish) : member.designationEnglish;
  const rawPhoto = getImageUrl(member.photoUrl);

  return (
    <div
      className={member.isCoreLeader ? "card-glass" : "card-white"}
      style={{
        padding: "2rem 1.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}
    >
      {/* Leadership Crown / Core Leader Tag */}
      {member.isCoreLeader && (
        <div style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.65rem",
          backgroundColor: "rgba(212, 175, 55, 0.2)",
          border: "1px solid var(--primary-gold)",
          borderRadius: "var(--radius-full)",
          color: "var(--primary-gold)",
          fontSize: "0.75rem",
          fontWeight: 700
        }}>
          <Award size={12} />
          <span>{lang === "mr" ? "मुख्य कार्यकारिणी" : "Core Leader"}</span>
        </div>
      )}

      {/* Portrait Photo */}
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        overflow: "hidden",
        border: member.isCoreLeader ? "3px solid var(--primary-gold)" : "3px solid #E2E8F0",
        boxShadow: member.isCoreLeader ? "0 0 20px rgba(212, 175, 55, 0.35)" : "var(--shadow-md)",
        marginBottom: "1.25rem",
        backgroundColor: "#0E1A33"
      }}>
        <img
          src={rawPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
          alt={fullName}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Full Name */}
      <h3 style={{
        fontSize: "1.2rem",
        fontWeight: 700,
        fontFamily: "var(--font-heading)",
        color: member.isCoreLeader ? "#FFFFFF" : "var(--text-main)",
        marginBottom: "0.4rem",
        lineHeight: 1.3
      }}>
        {fullName}
      </h3>

      {/* Designation Badge */}
      <div style={{
        display: "inline-block",
        padding: "0.3rem 0.85rem",
        backgroundColor: member.isCoreLeader ? "rgba(212, 175, 55, 0.15)" : "#F1F5F9",
        border: member.isCoreLeader ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid #CBD5E1",
        borderRadius: "var(--radius-full)",
        fontSize: "0.825rem",
        fontWeight: 700,
        color: member.isCoreLeader ? "var(--primary-gold)" : "var(--text-main)",
        marginBottom: "1rem"
      }}>
        {designation}
      </div>

      {/* District / Location */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.875rem",
        color: member.isCoreLeader ? "var(--text-light-muted)" : "var(--text-muted)",
        marginBottom: "1rem"
      }}>
        <MapPin size={15} color="var(--primary-gold-dark)" />
        <span>{member.villageOrCity ? `${member.villageOrCity}, ` : ""}{member.district}</span>
      </div>

      {/* Contact Pills */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        marginTop: "auto",
        borderTop: member.isCoreLeader ? "1px solid rgba(255,255,255,0.1)" : "1px solid #F1F5F9",
        paddingTop: "1rem",
        width: "100%",
        justifyContent: "center"
      }}>
        {member.mobileNumber && (
          <a
            href={`tel:${member.mobileNumber}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: member.isCoreLeader ? "rgba(255,255,255,0.08)" : "#F8FAFC",
              color: member.isCoreLeader ? "#FFFFFF" : "var(--text-main)",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            <Phone size={13} color="var(--primary-gold)" />
            <span>{member.mobileNumber}</span>
          </a>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-md)",
              backgroundColor: member.isCoreLeader ? "rgba(255,255,255,0.08)" : "#F8FAFC",
              color: member.isCoreLeader ? "#FFFFFF" : "var(--text-main)",
              textDecoration: "none"
            }}
            title={member.email}
          >
            <Mail size={14} color="var(--primary-gold)" />
          </a>
        )}
      </div>
    </div>
  );
};
