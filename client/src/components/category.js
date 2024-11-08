import React from 'react';

const Category = () => {
  return (
    <div>
      <h1>Art Page</h1>
      <div className="card-container">
        {papers.map((paper) => (
          <div key={paper._id} className="paper-card">
            <img src="/default-icon.png" alt="Research Paper Icon" className="paper-icon" />
            <div className="paper-details">
              <h3 className="paper-title">{paper.filename}</h3>
              <p className="paper-description">{paper.description}</p>
              <p className="paper-date">Released on: {paper.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
