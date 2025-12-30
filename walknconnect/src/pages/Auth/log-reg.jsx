import { memo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './log-reg.modules.css';

const LogReg = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const [loginData, setLoginData] = useState({
    login: "",
    password: ""
  });

  const [regData, setRegData] = useState({
    full_name: "",
    email: "",
    number: "",
    role: "",
    password: ""
  });

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost/WalknConnect/walknconnect-backend/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        // ✅ Save logged-in user
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect to home page
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error / Failed to fetch");
    }
  };


  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost/WalknConnect/walknconnect-backend/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regData),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        console.log("LOGIN RESPONSE:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error / Failed to fetch");
    }
  };


  return (
    <>
      <div id="main">
        <div id="header">
          <a href="/" id="hyperlink">
            <div className="left-nav">
              <div id="icon">
                <img src="./icon.png" alt="logo" />
              </div>
              <span id="logoname">walknConnect</span>
            </div>
          </a>
        </div>

        <div className="login-img">
          <img
            id="walking-men"
            src="../public/login-bg.png"
            alt="walking men img"
          />
        </div>

        <div className="main-container">
          {/* LOGIN */}
          {!showLogin && (
            <form className="login-div" id="login" onSubmit={handleLogin}>
              <h1 id="auth-head">Welcome back</h1>

              <input
                type="text"
                placeholder="Email / Phone / Username"
                required
                onChange={(e) =>
                  setLoginData({ ...loginData, login: e.target.value })
                }
              /><br />

              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              /><br />

              <input type="submit" className="submit" value="Login" />

              <p>
                I don't have an account!{" "}
                <a href="#register" onClick={() => setShowLogin(true)}>
                  Register
                </a>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {showLogin && (
            <form className="register-div" id="register" onSubmit={handleRegister}>
              <h1 id="auth-head">Join WalknConnect</h1>

              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) =>
                  setRegData({ ...regData, full_name: e.target.value })
                }
              /><br />

              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) =>
                  setRegData({ ...regData, email: e.target.value })
                }
              /><br />

              <input
                type="number"
                placeholder="Phone No."
                required
                onChange={(e) =>
                  setRegData({ ...regData, number: e.target.value })
                }
              /><br />

              <div className={`input-dropdown ${open ? "open" : ""}`}>
                <input
                  type="text"
                  placeholder="Select Role"
                  readOnly
                  value={regData.role || ""}
                  onClick={() => setOpen(!open)}
                />

                <span className="dropdown-arrow">▾</span>

                {open && (
                  <div className="dropdown-options">
                    <div
                      onClick={() => {
                        setRegData({ ...regData, role: "Walker" });
                        setOpen(false);
                      }}
                    >
                      Walker
                    </div>

                    <div
                      onClick={() => {
                        setRegData({ ...regData, role: "Vendor" });
                        setOpen(false);
                      }}
                    >
                      Vendor
                    </div>
                  </div>
                )}
              </div>

              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) =>
                  setRegData({ ...regData, password: e.target.value })
                }
              /><br />

              <input type="submit" className="submit" value="Register" />

              <p>
                I have an account!{" "}
                <a href="#login" onClick={() => setShowLogin(false)}>
                  Login
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(LogReg);
