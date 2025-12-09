import React, { useState } from "react";
import "./Settings.css";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  // NEW: Profile image upload state
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/120");

  // NEW: Handle file input change
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="settings-content">
        <div className="settings-header">
          <p className="breadcrumb">Pages / Settings</p>
          <h2>Account settings</h2>
        </div>

        <div className="settings-layout">
          {/* Left Tabs */}
          <div className="settings-tabs">
            {[
              { id: "profile", label: "Profile Settings", icon: "👤" },
              { id: "password", label: "Password", icon: "🔐" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "verification", label: "Verification", icon: "🛡️" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="settings-panel">
            {activeTab === "profile" && (
              <div>
                <h3>Profile Settings</h3>
                <p>Update your personal details and contact information.</p>

                {/* Updated Avatar Section */}
                <div className="profile-avatar-section">
                  <img src={profileImage} alt="avatar" className="profile-avatar" />

                  <label className="btn-primary upload-btn">
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                  </label>

                  <button className="btn-text" onClick={() => setProfileImage("https://i.pravatar.cc/120")}>
                    Delete avatar
                  </button>
                </div>

                <div className="form-grid">
                  <input placeholder="First name" />
                  <input placeholder="Last name" />
                  <input placeholder="Email" />
                  <input placeholder="Mobile number" />
                  <input placeholder="Tax Identification Number" />
                  <input placeholder="Country" />
                  <input placeholder="Residential Address" className="full" />
                </div>

                <button className="btn-submit">Save Changes</button>
              </div>
            )}

            {/* Remaining Tabs (Same as before) */}
            {activeTab === "password" && (
              <div>
                <h3>Change Password</h3>
                <p>For your account's security, do not share your password.</p>

                <div className="form-grid">
                  <input placeholder="Current Password" type="password" />
                  <input placeholder="New Password" type="password" />
                  <input placeholder="Confirm New Password" type="password" />
                </div>

                <button className="btn-submit">Save Changes</button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h3>Notification Settings</h3>
                <p>Choose which notifications you'd like to receive.</p>

                <div className="toggle-list">
                  {[
                    "Job Updates",
                    "New Messages",
                    "System Alerts",
                    "Job Reminders",
                    "Clock-in/out Alerts",
                  ].map((label) => (
                    <label className="toggle-item" key={label}>
                      <span>{label}</span>
                      <input type="checkbox" />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div>
                <h3>Verification</h3>
                <p>Improve account security and identity verification.</p>

                <div className="verification-card">
                  <h4>Email Verification</h4>
                  <p>Your email address helps keep your account secure.</p>
                  <div className="verified-status">✔ example@mail.com (Verified)</div>
                </div>

                <button className="btn-submit"> Manage Verification </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
