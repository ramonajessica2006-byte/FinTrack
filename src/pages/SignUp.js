import React, { useState } from "react";
import "./Auth.css";
import { storage } from "../utils/storage";

const USER_TYPES = [
  { key: "student", icon: "🎓", label: "Student" },
  { key: "adult", icon: "💼", label: "Working Adult" },
  { key: "other", icon: "👤", label: "Other" },
];

export default function SignUp({ onSignedUp, onGoToLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });
  const [error, setError] = useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!form.userType) return setError("Please select what best describes you.");

    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      return setError("An account with this email already exists. Try logging in.");
    }

    const newUser = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      userType: form.userType,
    };

    storage.saveUsers([...users, newUser]);
    storage.setSession({ fullName: newUser.fullName, email: newUser.email, userType: newUser.userType });
    onSignedUp(newUser);
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-visual-brand">
          <div className="auth-visual-mark">F</div>
          <div className="auth-visual-brandtext">FinTrack</div>
        </div>
        <h2>One finance app that actually adapts to who you are.</h2>
        <p>
          FinTrack reads your real spending behavior and your profile — student or working
          professional — to give advice that's actually relevant to your life, not generic tips.
        </p>
        <div className="auth-visual-stats">
          <div>
            <div className="auth-visual-stat-num">2</div>
            <div className="auth-visual-stat-label">Personalization profiles</div>
          </div>
          <div>
            <div className="auth-visual-stat-num">₹0</div>
            <div className="auth-visual-stat-label">Cost to get started</div>
          </div>
          <div>
            <div className="auth-visual-stat-num">100%</div>
            <div className="auth-visual-stat-label">Private — on your device</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card">
          <h1>Create your account</h1>
          <p>Start getting financial guidance built around your life.</p>

          {error && <div className="auth-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Ramona Sharma" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <div className="field">
              <label>I am a...</label>
              <div className="auth-usertype-grid">
                {USER_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.key}
                    className={`usertype-option ${form.userType === t.key ? "selected" : ""}`}
                    onClick={() => update("userType", t.key)}
                  >
                    <span className="usertype-option-icon">{t.icon}</span>
                    <span className="usertype-option-label">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="usertype-hint">
              Your profile helps FinTrack provide financial recommendations that are relevant to you.
            </div>

            <button type="submit" className="btn btn-primary btn-block">Create Account</button>
          </form>

          <div className="auth-footer-link">
            Already have an account? <button onClick={onGoToLogin}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
