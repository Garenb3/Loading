import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import profileImg from "../images/Profile.jpg";
import { ToastContainer, useToast } from "./Toast";

function Profile({ user, onUserUpdate, isGuest }) {
  const [photo, setPhoto] = useState(() => localStorage.getItem("profilePhoto") || null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverPhoto, setHoverPhoto] = useState(false);
  const { toasts, showToast } = useToast();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState(1);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCurrentPassword, setVerifyCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailVerifyPassword, setEmailVerifyPassword] = useState("");
  const [emailVerifyError, setEmailVerifyError] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);
      showToast("Profile photo updated!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (email !== user.email) {
      setPendingEmail(email);
      setEmail(user.email);
      setShowEmailVerifyModal(true);
      setEditing(false);
      return;
    }
    const updated = { ...JSON.parse(localStorage.getItem("user") || "{}"), username, email };
    localStorage.setItem("user", JSON.stringify(updated));
    onUserUpdate(updated);
    setEditing(false);
    showToast("Profile saved!", "success");
  };

  const handleVerifyForPassword = () => {
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    if (verifyEmail !== saved.email || verifyCurrentPassword !== saved.password) {
      setPasswordError("Email or password is incorrect.");
      return;
    }
    setPasswordError("");
    setPasswordStep(2);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) { setPasswordError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setPasswordError("Password must be at least 6 characters."); return; }
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...saved, password: newPassword }));
    setPasswordError("");
    closePasswordModal();
    showToast("Password changed successfully!", "success");
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordStep(1);
    setVerifyEmail(""); setVerifyCurrentPassword("");
    setNewPassword(""); setConfirmNewPassword("");
    setPasswordError("");
  };

  const handleEmailVerify = () => {
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    if (emailVerifyPassword !== saved.password) { setEmailVerifyError("Incorrect password."); return; }
    const updated = { ...saved, username, email: pendingEmail };
    localStorage.setItem("user", JSON.stringify(updated));
    onUserUpdate(updated);
    setEmail(pendingEmail);
    setEmailVerifyError(""); setEmailVerifyPassword("");
    setShowEmailVerifyModal(false);
    showToast("Email updated!", "success");
  };

  const closeEmailModal = () => {
    setShowEmailVerifyModal(false);
    setEmailVerifyPassword(""); setEmailVerifyError(""); setPendingEmail("");
  };

  const handleRatingSubmit = () => {
    if (rating === 0) return;
    showToast(`Thanks for rating us ${rating} star${rating > 1 ? "s" : ""}! ⭐`, "success");
    setRating(0); setHoverRating(0);
  };

  const modalOverlay = {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
  };
  const modalBox = {
    backgroundColor: "var(--secondary)", borderRadius: "12px", padding: "32px",
    maxWidth: "360px", width: "90%", display: "flex", flexDirection: "column", gap: "12px"
  };
  const modalInput = {
    backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px", padding: "8px 12px", color: "var(--text)", fontSize: "14px", width: "100%",
    boxSizing: "border-box",
  };
  const primaryBtn = {
    backgroundColor: "var(--primary)", color: "#fff", border: "none",
    borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "bold", width: "100%"
  };
  const ghostBtn = {
    backgroundColor: "transparent", color: "var(--text)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px", padding: "10px", cursor: "pointer", width: "100%"
  };
  const ovalBtn = {
    display: "block", width: "80%", margin: "6px auto 0",
    padding: "8px 0", borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "var(--text)", cursor: "pointer",
    fontSize: "13px", fontWeight: "bold", transition: "background-color 0.2s"
  };

  return (
    <aside className="profile-section">
      <ToastContainer toasts={toasts} />
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

      {/* Not Logged In Popup */}
      {showLoginPrompt && (
        <div onClick={() => setShowLoginPrompt(false)} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...modalBox, textAlign: "center", gap: "16px" }}>
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>You're not logged in!</h3>
            <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>Join us to track your watchlist, favorites, and more.</p>
            <Link to="/Login" style={{ textDecoration: "none", width: "100%" }}>
              <button style={primaryBtn}>Join Us!</button>
            </Link>
            <button style={ghostBtn} onClick={() => setShowLoginPrompt(false)}>Maybe Later</button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div onClick={closePasswordModal} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalBox}>
            {passwordStep === 1 ? (
              <>
                <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Verify Identity</h3>
                <p style={{ opacity: 0.6, fontSize: "13px" }}>Enter your email and current password to continue.</p>
                <input style={modalInput} type="email" placeholder="Your email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} />
                <input style={modalInput} type="password" placeholder="Current password" value={verifyCurrentPassword} onChange={(e) => setVerifyCurrentPassword(e.target.value)} />
                {passwordError && <p style={{ color: "#e50914", fontSize: "13px" }}>{passwordError}</p>}
                <button style={primaryBtn} onClick={handleVerifyForPassword}>Continue</button>
                <button style={ghostBtn} onClick={closePasswordModal}>Cancel</button>
              </>
            ) : (
              <>
                <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>New Password</h3>
                <input style={modalInput} type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input style={modalInput} type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                {passwordError && <p style={{ color: "#e50914", fontSize: "13px" }}>{passwordError}</p>}
                <button style={primaryBtn} onClick={handleChangePassword}>Change Password</button>
                <button style={ghostBtn} onClick={closePasswordModal}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Verify Modal */}
      {showEmailVerifyModal && (
        <div onClick={closeEmailModal} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalBox}>
            <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Confirm Email Change</h3>
            <p style={{ opacity: 0.6, fontSize: "13px" }}>Enter your password to update your email to <strong>{pendingEmail}</strong>.</p>
            <input style={modalInput} type="password" placeholder="Your password" value={emailVerifyPassword} onChange={(e) => setEmailVerifyPassword(e.target.value)} />
            {emailVerifyError && <p style={{ color: "#e50914", fontSize: "13px" }}>{emailVerifyError}</p>}
            <button style={primaryBtn} onClick={handleEmailVerify}>Confirm</button>
            <button style={ghostBtn} onClick={closeEmailModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Profile Picture */}
      <div
        style={{ position: "relative", width: "100px", height: "100px" }}
        onClick={() => editing && fileInputRef.current.click()}
        onMouseEnter={() => editing && setHoverPhoto(true)}
        onMouseLeave={() => setHoverPhoto(false)}
      >
        <img
          src={photo || profileImg}
          alt="User profile"
          className="profile-pic"
          style={{ width: "100px", height: "100px", display: "block" }}
        />
        {editing && hoverPhoto && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", cursor: "pointer"
          }}>
            📷
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (isGuest) { setShowLoginPrompt(true); return; }
          editing ? handleSave() : setEditing(true);
        }}
        style={{ ...ovalBtn, backgroundColor: editing ? "var(--primary)" : "rgba(255,255,255,0.08)" }}
      >
        {editing ? "💾 Save Profile" : "✏️ Edit Profile"}
      </button>

      {!isGuest && (
        <button onClick={() => setShowPasswordModal(true)} style={ovalBtn}>
          🔒 Change Password
        </button>
      )}

      {editing ? (
        <>
          <div className="info-box">
            <strong>Username:</strong>
            <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ ...modalInput, marginTop: "6px" }} />
          </div>
          <div className="info-box">
            <strong>Email:</strong>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...modalInput, marginTop: "6px" }} />
          </div>
        </>
      ) : (
        <>
          <div className="info-box"><strong>Username:</strong> {username}</div>
          <div className="info-box"><strong>Email:</strong> {email}</div>
        </>
      )}

      <div style={{ width: "80%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "16px auto" }} />

      {/* Rate Us */}
      <section style={{ textAlign: "center", padding: "0 16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>Rate Us!</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "14px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                fontSize: "28px", cursor: "pointer",
                color: star <= (hoverRating || rating) ? "#f5c518" : "rgba(255,255,255,0.2)",
                transition: "color 0.15s, transform 0.15s",
                transform: star <= (hoverRating || rating) ? "scale(1.2)" : "scale(1)"
              }}
            >★</span>
          ))}
        </div>
        <button
          onClick={handleRatingSubmit}
          disabled={rating === 0}
          style={{
            ...ovalBtn, margin: "0 auto",
            backgroundColor: rating > 0 ? "var(--primary)" : "rgba(255,255,255,0.05)",
            opacity: rating > 0 ? 1 : 0.4,
            cursor: rating > 0 ? "pointer" : "default"
          }}
        >
          Submit Rating
        </button>
      </section>
    </aside>
  );
}

export default Profile;
