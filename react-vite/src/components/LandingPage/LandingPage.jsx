import './LandingPage.css';
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import { useSelector } from 'react-redux';
import { FaMoneyCheckAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
  const user = useSelector(state => state.session.user);

  return (
    <div className="landing-page-container">
<div className="hero-section">
  <div className="hero-image">
    <img src="/FullLogo_Transparent_NoBuffer.png" alt="Hero Logo" />
  </div>

  <div className="hero-text">
    <h2>Take control of your finances</h2>
    <p>
      Our platform helps you effortlessly manage shared expenses, ensuring that everyone
      pays their fair share. Say goodbye to awkward money conversations and hello to
      transparency and peace of mind.
    </p>
    {!user && (
            <div className="auth-buttons">
              <OpenModalButton
                buttonText="Get Started"
                modalComponent={<SignupFormModal />}
                className="cta-button"
              />
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                className="cta-button login-button"
              />
            </div>
          )}
</div>
</div>
      {/* Features Section */}
      <div className="features-section">
        <h3>Why Choose Us?</h3>
        <div className="features-list">
          <div className="feature-card">
            <FaMoneyCheckAlt className="feature-icon" />
            <h4>Expense Tracking</h4>
            <p>Track shared expenses easily with detailed reports and split costs fairly.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h4>Group Management</h4>
            <p>Effortlessly create and manage groups with your friends or colleagues.</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h4>Balance Calculation</h4>
            <p>See who owes whom at a glance with automatic balance updates.</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="pricing-section">
        <h3>Pricing</h3>
        <div className="pricing-options">
          <div className="pricing-card" onClick={() => alert('Feature coming soon!')}>
            <h4>Free Trial</h4>
            <p>Try all features for free for 30 days. No credit card required.</p>
          </div>
          <div className="pricing-card" onClick={() => alert('Feature coming soon!')}>
            <h4>Monthly</h4>
            <p>$9.99 per month. Cancel anytime.</p>
          </div>
          <div className="pricing-card" onClick={() => alert('Feature coming soon!')}>
            <h4>Yearly</h4>
            <p>$99.99 per year. Save 20%.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4>What is the free trial period?</h4>
            <p>You can use all features free for 30 days, no credit card required. After the trial ends, you can choose a paid plan.</p>
          </div>
          <div className="faq-item">
            <h4>How do I cancel my subscription?</h4>
            <p>You can cancel your subscription at any time from your account settings without any hidden fees.</p>
          </div>
          <div className="faq-item">
            <h4>Is my data secure?</h4>
            <p>Yes, we use top-level encryption and never share your personal information with third parties.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <p>© 2024 FairShare. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
