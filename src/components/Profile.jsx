import React, { useState, useRef } from "react";
import profileImg from "../images/Profile.jpg";

function Profile({ user }) {
  const [photo, setPhoto] = useState(null);
  const [review, setReview] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // preview uploaded photo
    }
  };

  return (
    <aside className="profile-section">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <img
        src={photo || profileImg}
        alt="User profile"
        className="profile-pic"
        onClick={() => fileInputRef.current.click()}
      />

      <div className="info-box">
        <strong>Username:</strong> {user.username}
      </div>
      <div className="info-box">
        <strong>Email:</strong> {user.email}
      </div>

      <section className="review-box">
        <h3>Leave a Review</h3>
        <textarea
          placeholder="Write something..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button>Submit</button>
      </section>
    </aside>
  );
}

export default Profile;