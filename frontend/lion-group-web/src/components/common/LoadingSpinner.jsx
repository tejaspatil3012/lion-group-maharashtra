import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useServerStatus } from "../../context/ServerStatusContext";
import { Cloud, RefreshCw, AlertTriangle } from "lucide-react";

export const LoadingSpinner = ({ message, subtitle }) => {
  const { lang, t } = useLanguage();
  const { isWakingUp, isRetrying, retryAttempt, maxRetries } = useServerStatus();
  const [showWakeupTip, setShowWakeupTip] = useState(false);

  // If loading takes longer than 3.5 seconds, display friendly wake-up message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWakeupTip(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const isWaking = isWakingUp || isRetrying || showWakeupTip;

  return (
    <div className="loader-container">
      <div className="loader-visual-wrapper">
        <div className="spinner"></div>
        {isWaking && (
          <div className="spinner-center-icon">
            <Cloud size={18} className="spin-slow text-gold" />
          </div>
        )}
      </div>

      <h4 className="loader-title">
        {isWaking
          ? (t.common?.serverWakingUp || (lang === "mr" ? "सर्व्हर सुरू होत आहे..." : "Server is waking up..."))
          : (message || t.common?.loading || "Loading...")}
      </h4>

      {isWaking && (
        <div className="loader-wakeup-box">
          <p className="loader-wakeup-desc">
            {subtitle ||
              t.common?.serverWakingUpDesc ||
              (lang === "mr"
                ? "विनामूल्य क्लाउड सर्व्हर सुरू होण्यास ३०-४५ सेकंद लागू शकतात. कृपया थांबा, पेज रिफ्रेश करण्याची गरज नाही; माहिती आपोआप लोड होईल."
                : "The cloud server is waking up after inactivity. Hang tight, no refresh needed — data will load automatically.")}
          </p>

          {isRetrying && retryAttempt > 0 && (
            <div className="loader-retry-pill">
              <RefreshCw size={14} className="spin" />
              <span>
                {lang === "mr"
                  ? `${t.common?.retryAttempt || "प्रयत्न"} ${retryAttempt} ${t.common?.of || "पैकी"} ${maxRetries}...`
                  : `${t.common?.retryAttempt || "Attempt"} ${retryAttempt} ${t.common?.of || "of"} ${maxRetries}...`}
              </span>
            </div>
          )}

          <div className="loader-indeterminate-bar">
            <div className="loader-indeterminate-progress"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  const { lang, t } = useLanguage();
  const [retryingIn, setRetryingIn] = useState(null);

  const isColdStartOrTimeout =
    message &&
    (message.toLowerCase().includes("waking up") ||
      message.toLowerCase().includes("timeout") ||
      message.toLowerCase().includes("connect to the server") ||
      message.toLowerCase().includes("network error"));

  return (
    <div className="error-message-card">
      <div className="error-icon-wrapper">
        <AlertTriangle size={36} color="#DC2626" />
      </div>

      <h3 className="error-title">
        {isColdStartOrTimeout
          ? (lang === "mr"
              ? "सर्व्हर प्रतिसाद देण्यास वेळ घेत आहे"
              : "Server is taking longer to respond")
          : (t.common?.errorLoading || "Error Loading Data")}
      </h3>

      <p className="error-description">
        {message || t.common?.errorLoading}
      </p>

      {isColdStartOrTimeout && (
        <p className="error-help-text">
          {lang === "mr"
            ? "विनामूल्य क्लाउड सर्व्हर सुरू होत असताना थोडा विलंब होऊ शकतो. कृपया खालील बटनावर क्लिक करून पुन्हा प्रयत्न करा."
            : "Cloud servers on free tier take a moment to wake up after a period of inactivity. Please try again below."}
        </p>
      )}

      {onRetry && (
        <div style={{ marginTop: "1.25rem" }}>
          <button
            onClick={onRetry}
            className="btn btn-gold"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              fontSize: "0.95rem",
              fontWeight: 600
            }}
          >
            <RefreshCw size={16} />
            <span>{t.common?.retryNow || (lang === "mr" ? "पुन्हा प्रयत्न करा" : "Try Again Now")}</span>
          </button>
        </div>
      )}
    </div>
  );
};
