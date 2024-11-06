import React from 'react';
import './SectionComponent.css';

function SectionsComponent() {
  return (
    <div className="sections-container">
      {/* First row (2 cards) */}
      <div className="section-row">
        <div className="section art">
          <h2>Art</h2>
          <p>Explore the world of creativity and expression through visual arts, music, literature, and more.</p>
        </div>
        <div className="section commerce">
          <h2>Commerce</h2>
          <p>Understand the dynamics of trade, business, marketing, and finance.</p>
        </div>
      </div>

      {/* Second row (2 cards) */}
      <div className="section-row">
        <div className="section science">
          <h2>Science</h2>
          <p>Delve into the study of the natural world, technology, physics, biology, and more.</p>
        </div>
        <div className="section technology">
          <h2>Technology</h2>
          <p>Explore cutting-edge innovations and advancements in tech.</p>
        </div>
      </div>
    </div>
  );
}

export default SectionsComponent;
