import { memo } from "react";
import "./hero.modules.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/logreg");
    } else {
      navigate("/walker");
    }
  };

  return (
    <section className="section">
      <div className="sub-section-1">
        <p id="hero-head">
          Find Your Perfect <br />
          <span id="hero-head-span">Walking Partner</span>
        </p>

        <p id="hero-para">
          Connect with verified walking partners in your area. <br />
          Stay motivated, stay healthy, stay connected.
        </p>

        <button id="link" onClick={handleClick}>
          Get Started
        </button>
      </div>

      <div className="sub-section-2">
        <video autoPlay muted loop playsInline>
          <source
            src="https://assets.mixkit.co/videos/45560/45560-720.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default memo(Hero);
