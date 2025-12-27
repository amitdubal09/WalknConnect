import { memo } from 'react';
import './hero.modules.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/logreg");
    } else {
      navigate("/walker");
    }
  };

  // ✅ return is INSIDE the component
  return (
    <>
      <div className="section">
        <div className="sub-section-1">
          <div>
            <p id="hero-head">
              Find Your Perfect <br />
              <span id="hero-head-span">Walking Partner</span>
            </p>
          </div>

          <p id="hero-para">
            Connnect with verified walking partners in your area. Stay <br />
            motivated, stay healthy, stay connected.
          </p>

          <div id="login-link">
            <a href="#" id="link" onClick={handleClick}>
              Get Started
            </a>
          </div>
        </div>

        <div className="sub-section-2">
          <img src="./Heroimage.jpg" alt="Hero" />
        </div>
      </div>
    </>
  );
};

export default memo(Hero);
