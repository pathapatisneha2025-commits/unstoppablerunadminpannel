import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Replace with your backend endpoint
      const res = await fetch("https://medicurehospitaldatabase.onrender.com/admin/reset-passwordd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) throw new Error("Password reset failed");

      alert("Password updated successfully!");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="form-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>

      <style>{`
        .forgot-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .form-container {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        h2 {
          color: #0F172A;
          margin-bottom: 25px;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          font-size: 14px;
          outline: none;
        }

        button {
          background: #FF6B00;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #e65a00;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .form-container { padding: 30px 20px; }
          input { padding: 10px; font-size: 13px; }
          button { padding: 10px; font-size: 14px; }
        }
      `}</style>
    </div>
  );
}
