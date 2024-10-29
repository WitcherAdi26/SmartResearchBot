import React from 'react';
import CustomInput from '../components/CustomInput';
import Card from '../components/Card';
import '../components/Home.css'; // Ensure you have this CSS file

const Home = () => {
  return (
    <div className="home-container">
      <div className="card-container">
        <Card title="Art" path="/art" />
        <Card title="Commerce" path="/commerce" />
        <Card title="Science" path="/science" />
      </div>
      
      {/* Custom Input below the cards */}
      <CustomInput />
    </div>
  );
};

export default Home;
