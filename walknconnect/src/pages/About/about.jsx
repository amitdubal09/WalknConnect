import { memo } from 'react';
import './about.modules.css';
import { Link } from 'react-router-dom';
function AboutUs() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null;
  return (
    <div className="about-container">
      <div className="hero-section">
        <h1>WalknConnect</h1>
        <p>Connecting people one step at a time. Discover, explore, and engage with the world around you.</p>
      </div>

      <div className="content-section">
        <div className="section-wrapper">
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p>
              At WalknConnect, we believe that the best connections are made when people step outside and explore together.
              Our platform is designed to bring communities closer by encouraging walking, discovery, and meaningful interactions.
              Whether you're exploring your neighborhood or venturing into new areas, we're here to make every step count.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚶</div>
              <h3>Walk Together</h3>
              <p>Join walking groups, find companions, and make fitness a social experience.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Discover Places</h3>
              <p>Explore hidden gems, local attractions, and popular destinations in your area.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Build Community</h3>
              <p>Connect with like-minded individuals and strengthen local bonds.</p>
            </div>
          </div>

          <div className="values-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <h3>Health</h3>
                <p>Promoting active lifestyles and wellbeing through walking.</p>
              </div>
              <div className="value-item">
                <h3>Community</h3>
                <p>Building stronger neighborhoods through shared experiences.</p>
              </div>
              <div className="value-item">
                <h3>Discovery</h3>
                <p>Encouraging exploration and appreciation of local environments.</p>
              </div>
              <div className="value-item">
                <h3>Connection</h3>
                <p>Fostering genuine relationships and social engagement.</p>
              </div>
            </div>
          </div>
          {/* HOW IT WORKS */}
          <div className="how-section">
            <h2>How It Works</h2>
            <div className="how-grid">
              <div className="how-card">
                <span>1</span>
                <h3>Create an Account</h3>
                <p>Sign up and set up your walking preferences.</p>
              </div>
              <div className="how-card">
                <span>2</span>
                <h3>Find Walkers</h3>
                <p>Discover nearby people with similar walking goals.</p>
              </div>
              <div className="how-card">
                <span>3</span>
                <h3>Start Walking</h3>
                <p>Connect, walk together, and build healthy habits.</p>
              </div>
            </div>
          </div>

          {/* WHO IT'S FOR */}
          <div className="audience-section">
            <h2>Who Is This For?</h2>
            <div className="audience-grid">
              <div className="audience-item">👨‍👩‍👧 Families</div>
              <div className="audience-item">🏃 Fitness Enthusiasts</div>
              <div className="audience-item">🧑‍💼 Busy Professionals</div>
              <div className="audience-item">🧓 Senior Citizens</div>
            </div>
          </div>

          <section className="why-section">
            <h2>Why Choose WalknConnect</h2>

            <div className="why-grid">
              <div className="why-box">
                <h3>Verified Walkers</h3>
                <p>Connect with genuine and verified people who share your walking goals.</p>
              </div>

              <div className="why-box">
                <h3>Safe & Secure</h3>
                <p>Your safety matters. Profiles are moderated to ensure a trusted community.</p>
              </div>

              <div className="why-box">
                <h3>Stay Motivated</h3>
                <p>Walking with a partner keeps you consistent, active, and motivated.</p>
              </div>

              <div className="why-box">
                <h3>Local Community</h3>
                <p>Find walking partners nearby and build real-world connections.</p>
              </div>
            </div>
          </section>

          <div className="cta-section">
            <h2>Join Our Journey</h2>
            <p>Be part of a community that values health, connection, and exploration.</p>
            {!user && (
              <Link to="/logreg">
                <button className="cta-button">Get Started Today</button>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(AboutUs);