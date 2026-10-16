import React from "react";
import { useServerStatus } from "../../context/ServerStatusContext";
import { useLanguage } from "../../hooks/useLanguage";
import { Cloud, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";

export const ServerWakeupBanner = () => {
  const { isWakingUp, isRetrying, retryAttempt, maxRetries, status } = useServerStatus();
  const { lang, t } = useLanguage();

  const isVisible = isWakingUp || isRetrying || status === "connected";
  if (!isVisible) return null;

  const isConnected = status === "connected";

  return (
    <aside
      aria-label="Server status notification"
      className={`server-wakeup-banner ${isConnected ? "is-connected" : "is-active"}`}
    >
      <div className="server-wakeup-content">
        <div className="server-wakeup-icon">
          {isConnected ? (
            <CheckCircle2 size={18} className="icon-connected" />
          ) : isRetrying ? (
            <RefreshCw size={18} className="icon-retrying spin" />
          ) : (
            <Cloud size={18} className="icon-waking" />
          )}
        </div>

        <div className="server-wakeup-text">
          <span className="server-wakeup-title">
            {isConnected
              ? (lang === "mr" ? "सर्व्हर जोडला गेला!" : "Server Connected!")
              : (lang === "mr" ? "सर्व्हर सुरू होत आहे..." : "Cloud Server is Waking Up...")}
          </span>
          {isConnected && (
            <span className="server-wakeup-subtitle">
              {lang === "mr" ? "पेज लोड होत आहे..." : "Loading data..."}
            </span>
          )}
          {!isConnected && isRetrying && retryAttempt > 0 && (
            <span className="server-wakeup-subtitle">
              <span className="server-wakeup-attempt">
                {lang === "mr"
                  ? `${t.common.retryAttempt || "प्रयत्न"} ${retryAttempt}/${maxRetries}`
                  : `${t.common.retryAttempt || "Attempt"} ${retryAttempt}/${maxRetries}`}
              </span>
            </span>
          )}
        </div>
      </div>

      {!isConnected && (
        <div className="server-wakeup-progress-bar">
          <div className="server-wakeup-progress-indeterminate"></div>
        </div>
      )}
    </aside>
  );
};
