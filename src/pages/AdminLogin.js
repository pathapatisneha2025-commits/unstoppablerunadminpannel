import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = "https://medicurehospitaldatabase.onrender.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login Successful");
        navigate("/admin/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, sans-serif; background: #fff; }

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: #fff5f0; /* light orange-ish background */
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          padding: 36px;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          text-align: center;
        }

        .login-card h2 {
          margin-bottom: 10px;
          font-size: 26px;
          font-weight: 700;
          color: #0F172A;
        }

        .login-card h2 span {
          color: #FF6B00; /* Orange accent */
        }

        .login-form { display: flex; flex-direction: column; gap: 16px; text-align: left; }

        .login-input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border 0.2s;
        }

        .login-input:focus { border-color: #FF6B00; }

        .password-wrapper { position: relative; }

        .password-wrapper .eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
          color: #666;
        }

        .login-btn {
          padding: 14px;
          background: #FF6B00;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-btn:hover { background: #e55b00; }

        .signup-text {
          margin-top: 18px;
          font-size: 14px;
          color: #555;
          text-align: center;
        }

        .signup-text span {
          color: #FF6B00;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 20px; }
          .login-card h2 { font-size: 22px; }
        }

        @media (max-width: 768px) {
          .login-card { max-width: 380px; }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          <h2>
            RUNN<span>.</span>
          </h2>
          <p className="login-subtitle">Admin Login</p>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <span className="eye" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="signup-text">
            Forgot your password?{" "}
            <span onClick={() => navigate("/forgotpassword")}>Reset Password</span>
          </p>
        </div>
      </div>
    </>
  );
}
