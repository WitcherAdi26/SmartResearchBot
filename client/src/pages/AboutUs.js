import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../pages/AboutUs.css'; // Import the updated styles

const AboutUs = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRedirect = () => {
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="about-container">
      <h1 className="about-title">About Our Smart Summary Chatbot</h1>
      <p className="about-description">
        Welcome to <strong>Smart Summary Chatbot</strong>, your intelligent assistant for summarizing content effortlessly. Our chatbot is designed to help users quickly understand and digest large volumes of information in a concise format, making it easier to grasp key points and insights.
      </p>
      <h2 className="about-subtitle">Our Mission</h2>
      <p className="about-description">
        Our mission is to simplify information consumption. In a world overflowing with data, we strive to provide a tool that helps users save time and focus on what truly matters. Whether you're a student, a professional, or just a curious learner, our chatbot is here to assist you in summarizing articles, research papers, and more.
      </p>
      <h2 className="about-subtitle">Features</h2>
      <ul className="about-features">
        <li>⚡ Quick and Accurate Summaries</li>
        <li>🔍 User-Friendly Interface</li>
        <li>💬 Interactive Chat Experience</li>
        <li>📚 Multi-Format Support</li>
        <li>🌐 Available Anytime, Anywhere</li>
      </ul>
      <h2 className="about-subtitle">Get Started</h2>
      <p className="about-description">
        Ready to simplify your information gathering? Try our Smart Summary Chatbot today and experience the difference!
      </p>
      <button className="cta-button" onClick={handleRedirect}>Try It Now</button>

      {/* Help and Contact Us Links */}
      <div className="footer-links">
        <h3>Need Help?</h3>
        <ul>
          <li><a href="/help">Help</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
