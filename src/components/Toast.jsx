import { useEffect, useState } from "react";
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  return { toasts, showToast };
}

const TYPE_STYLES = {
  success: { background: "#22c55e", icon: "✓" },
  error: { background: "#ef4444", icon: "✕" },
  info: { background: "var(--primary)", icon: "ℹ" },
  warning: { background: "#f59e0b", icon: "⚠" },
};

export function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }) {
  const [visible, setVisible] = useState(false);
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: style.background,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        pointerEvents: "auto",
        minWidth: "220px",
        maxWidth: "340px",
      }}
    >
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          flexShrink: 0,
        }}
      >
        {style.icon}
      </span>
      {toast.message}
    </div>
  );
}
