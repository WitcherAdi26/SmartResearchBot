import React from 'react';
import PropTypes from 'prop-types'; // Ensure that prop types are defined for validation
import '../components/Card.css'
const Card = ({ title, path }) => {
  return (
    <div className="card">
      <a href={path} target="_blank" rel="noopener noreferrer" className="card-link">
        <div className="card-title">{title}</div>
      </a>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Card;

