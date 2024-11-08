import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types'; // Ensure that prop types are defined for validation
import '../components/Card.css'
import axios from 'axios';

const Card = ({ title, path }) => {
  const [papers, setPapers] = useState([]);

  const getResearchPapers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/papers/${title}`);
      console.log(response.data);
      setPapers(response.data);      
    } catch (error) {
      console.log("Error while fetching research papers : ",error);
      alert("Something went wrong!");
    }
  }

  useEffect(()=>{
    getResearchPapers();
  },[]);

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

