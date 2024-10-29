// Card.js
import React from 'react';
import './Card.css'; // Ensure to import the corresponding CSS

const Card = ({ title, path }) => {
  return (
    <div className="card" onClick={() => window.location.href = path}>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default Card;
