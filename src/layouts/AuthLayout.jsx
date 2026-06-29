import React from 'react';
import '../styles/Auth.css';

const AuthLayout = ({ children }) => (
  <main className="auth-container">
    <section className="auth-left">
      <div className="branding-wrapper">
        
        {/* Full-width Heading Section */}
        <div className="header-top">
          <div className="app-badge">AI Education</div>
          <h1>Empowering Minds with AI Education</h1>
        </div>

        <div className="layout-split">
          <div className="content-side">
            <p className="description">
              The premier digital ecosystem designed to bridge the gap between traditional 
              academics and the rapidly evolving world of artificial intelligence.
            </p>
            <ul className="feature-list">
              <li><strong>Smart Learning:</strong> Adaptive pathways tailored to your unique goals.</li>
              <li><strong>Track Progress:</strong> Real-time skill analytics to measure your growth.</li>
              <li><strong>AI Assistance:</strong> 24/7 intelligent mentorship for instant support.</li>
            </ul>
          </div>

          <div className="image-side">
            <img src="/login/illustration.png" alt="AI Learning Illustration" />
          </div>
        </div>

      </div>
    </section>

    <section className="auth-right">
      <div className="login-card">
        {children}
      </div>
    </section>
  </main>
);

export default AuthLayout;