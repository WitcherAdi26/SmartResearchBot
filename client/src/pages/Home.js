// Home.js
import React from 'react';
import SectionsComponent from '../components/SectionComponent'; // Import the SectionsComponent
import CustomInput from '../components/CustomInput';
import Card from '../components/Card';
import '../components/Home.css'; // Ensure you have this CSS file

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-container">
        <div className="sections-and-chat">
          {/* Cards container with 2 rows of 3 cards each */}
          <div className="card-container">
            <Card title="Art" path="/art" />
            <Card title="Commerce" path="/commerce" />
            <Card title="Science" path="/science" />
            <Card title="Mathematics" path="/mathematics" />
            <Card title="Technology" path="/technology" />
            <Card title="Engineering" path="/engineering" />
            
          </div>
        </div>

        <div className="chat-input-container">
          <div className="custom-input-section">
            <CustomInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
