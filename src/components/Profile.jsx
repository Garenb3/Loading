import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import profileImg from "../images/Profile.jpg";
import { ToastContainer, useToast } from "./Toast";
import { authFetch } from "../utils/authService";

function Profile({ user, onUserUpdate, isGuest }) {
  const [photo, setPhoto] = useState(
    () => localStorage.getItem("profilePhoto") || null,
  );
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverPhoto, setHoverPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
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
  const userId = user?._id;

  // ── Photo upload ──────────────────────────────────────────
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

  // ── Save profile (username/email) via API ─────────────────
  const handleSave = async () => {
    if (email !== user.email) {
      setPendingEmail(email);
      setEmail(user.email);
      setShowEmailVerifyModal(true);
      setEditing(false);
      return;
    }
    try {
      setSaving(true);
      const updated = await authFetch(`/user/${userId}`, "PUT", { username });
      const newUser = { ...user, username: updated.username };
      localStorage.setItem("user", JSON.stringify(newUser));
      onUserUpdate(newUser);
      setEditing(false);
      showToast("Profile saved!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Password change (still local — backend has no change-password route yet) ──
  const handleVerifyForPassword = () => {
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    if (
      verifyEmail !== saved.email ||
      verifyCurrentPassword !== saved.password
    ) {
      setPasswordError("Email or password is incorrect.");
      return;
    }
    setPasswordError("");
    setPasswordStep(2);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...saved, password: newPassword }),
    );
    setPasswordError("");
    closePasswordModal();
    showToast("Password changed successfully!", "success");
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordStep(1);
    setVerifyEmail("");
    setVerifyCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
  };

  // ── Email change via API ──────────────────────────────────
  const handleEmailVerify = async () => {
    try {
      setSaving(true);
      const updated = await authFetch(`/user/${userId}`, "PUT", {
        email: pendingEmail,
      });
      const newUser = { ...user, username, email: updated.email };
      localStorage.setItem("user", JSON.stringify(newUser));
      onUserUpdate(newUser);
      setEmail(pendingEmail);
      setEmailVerifyError("");
      setEmailVerifyPassword("");
      setShowEmailVerifyModal(false);
      showToast("Email updated!", "success");
    } catch (err) {
      setEmailVerifyError(err.message || "Failed to update email.");
    } finally {
      setSaving(false);
    }
  };

  const closeEmailModal = () => {
    setShowEmailVerifyModal(false);
    setEmailVerifyPassword("");
    setEmailVerifyError("");
    setPendingEmail("");
  };

  const handleRatingSubmit = () => {
    if (rating === 0) return;
    showToast(
      `Thanks for rating us ${rating} star${rating > 1 ? "s" : ""}! ⭐`,
      "success",
    );
    setRating(0);
    setHoverRating(0);
  };

  // ── Shared styles ─────────────────────────────────────────
  const modalOverlay = {
    position: "fixed",
    inset: 0,
    backgroundColor: "var(--secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  };
  const modalBox = {
    backgroundColor: "var(--secondary)",
    borderRadius: "12px",
    padding: "32px",
    maxWidth: "360px",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };
  const modalInput = {
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "var(--text)",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  };
  const primaryBtn = {
    backgroundColor: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  };
  const ghostBtn = {
    backgroundColor: "transparent",
    color: "var(--text)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    width: "100%",
  };
  const ovalBtn = {
    display: "block",
    width: "80%",
    margin: "6px auto 0",
    padding: "8px 0",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };

  return (
    <>
      <ToastContainer toasts={toasts} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ── Fixed profile panel ── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "260px",
          height: "100vh",
          backgroundColor: "var(--secondary)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "2px 0 16px rgba(0,0,0,0.2)",
          overflowY: "auto",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 16px",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        {/* Login prompt modal */}
        {showLoginPrompt && (
          <div onClick={() => setShowLoginPrompt(false)} style={modalOverlay}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ ...modalBox, textAlign: "center", gap: "16px" }}
            >
              <div style={{ fontSize: "40px" }}>🎬</div>
              <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                You're not logged in!
              </h3>
              <p style={{ opacity: 0.6, fontSize: "13px", margin: 0 }}>
                Join us to track your watchlist, favorites, and more.
              </p>
              <Link
                to="/login"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <button style={primaryBtn}>Join Us!</button>
              </Link>
              <button
                style={ghostBtn}
                onClick={() => setShowLoginPrompt(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div onClick={closePasswordModal} style={modalOverlay}>
            <div onClick={(e) => e.stopPropagation()} style={modalBox}>
              {passwordStep === 1 ? (
                <>
                  <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>
                    Verify Identity
                  </h3>
                  <p style={{ opacity: 0.6, fontSize: "13px" }}>
                    Enter your email and current password to continue.
                  </p>
                  <input
                    style={modalInput}
                    type="email"
                    placeholder="Your email"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                  />
                  <input
                    style={modalInput}
                    type="password"
                    placeholder="Current password"
                    value={verifyCurrentPassword}
                    onChange={(e) => setVerifyCurrentPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p style={{ color: "#e50914", fontSize: "13px" }}>
                      {passwordError}
                    </p>
                  )}
                  <button style={primaryBtn} onClick={handleVerifyForPassword}>
                    Continue
                  </button>
                  <button style={ghostBtn} onClick={closePasswordModal}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>
                    New Password
                  </h3>
                  <input
                    style={modalInput}
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    style={modalInput}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p style={{ color: "#e50914", fontSize: "13px" }}>
                      {passwordError}
                    </p>
                  )}
                  <button style={primaryBtn} onClick={handleChangePassword}>
                    Change Password
                  </button>
                  <button style={ghostBtn} onClick={closePasswordModal}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Email Verify Modal */}
        {showEmailVerifyModal && (
          <div onClick={closeEmailModal} style={modalOverlay}>
            <div onClick={(e) => e.stopPropagation()} style={modalBox}>
              <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>
                Confirm Email Change
              </h3>
              <p style={{ opacity: 0.6, fontSize: "13px" }}>
                Updating email to <strong>{pendingEmail}</strong>.
              </p>
              <input
                style={modalInput}
                type="password"
                placeholder="Your password"
                value={emailVerifyPassword}
                onChange={(e) => setEmailVerifyPassword(e.target.value)}
              />
              {emailVerifyError && (
                <p style={{ color: "#e50914", fontSize: "13px" }}>
                  {emailVerifyError}
                </p>
              )}
              <button
                style={primaryBtn}
                onClick={handleEmailVerify}
                disabled={saving}
              >
                {saving ? "Saving..." : "Confirm"}
              </button>
              <button style={ghostBtn} onClick={closeEmailModal}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Profile picture */}
        <div
          style={{
            position: "relative",
            width: "100px",
            height: "100px",
            marginBottom: "4px",
          }}
          onClick={() => editing && fileInputRef.current.click()}
          onMouseEnter={() => editing && setHoverPhoto(true)}
          onMouseLeave={() => setHoverPhoto(false)}
        >
          <img
            src={photo || profileImg}
            alt="User profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--primary)",
              display: "block",
            }}
          />
          {editing && hoverPhoto && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              📷
            </div>
          )}
        </div>

        {/* Edit / Save button */}
        <button
          onClick={() => {
            if (isGuest) {
              setShowLoginPrompt(true);
              return;
            }
            editing ? handleSave() : setEditing(true);
          }}
          disabled={saving}
          style={{
            ...ovalBtn,
            backgroundColor: "var(--primary)",
            color : "#ffffff"
          }}
        >
          {saving
            ? "Saving..."
            : editing
              ? "💾 Save Profile"
              : "✏️ Edit Profile"}
        </button>

        {!isGuest && (
          <button onClick={() => setShowPasswordModal(true)} style={ovalBtn}>
            🔒 Change Password
          </button>
        )}

        {/* Username / Email display or edit */}
        {editing ? (
          <>
            <div style={{ width: "100%", marginTop: "8px" }}>
              <strong style={{ fontSize: "13px", opacity: 0.7 }}>
                Username
              </strong>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ ...modalInput, marginTop: "6px" }}
              />
            </div>
            <div style={{ width: "100%" }}>
              <strong style={{ fontSize: "13px", opacity: 0.7 }}>Email</strong>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...modalInput, marginTop: "6px" }}
              />
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--bg)",
                borderRadius: "8px",
                padding: "10px 12px",
                marginTop: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  opacity: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Username
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {username}
              </p>
            </div>
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--bg)",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  opacity: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Email
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  wordBreak: "break-all",
                }}
              >
                {email}
              </p>
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            width: "80%",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.1)",
            margin: "12px auto",
          }}
        />

        {/* Rate Us */}
        <section
          style={{ textAlign: "center", width: "100%", padding: "0 8px" }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "12px",
              marginTop: 0,
            }}
          >
            Rate Us!
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "14px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  fontSize: "26px",
                  cursor: "pointer",
                  color:
                    star <= (hoverRating || rating)
                      ? "#f5c518"
                      : "var(--starEmpty, rgba(255,255,255,))",
                  transition: "color 0.15s, transform 0.15s",
                  transform:
                    star <= (hoverRating || rating)
                      ? "scale(1.25)"
                      : "scale(1)",
                  userSelect: "none",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <button
            onClick={handleRatingSubmit}
            disabled={rating === 0}
            style={{
              ...ovalBtn,
              margin: "0 auto",
              backgroundColor:
                rating > 0
                  ? "var(--primary)"
                  : "var(--surfaceSubtle, rgba(255,255,255,))",
              borderColor:
                rating > 0 ? "var(--primary)" : "rgba(255,255,255,0.15)",
              color: rating > 0 ? "#fff" : "var(--text)",
              opacity: rating > 0 ? 1 : 0.45,
              cursor: rating > 0 ? "pointer" : "default",
            }}
          >
            Submit Rating
          </button>
        </section>
      </aside>
    </>
  );
}

export default Profile;
