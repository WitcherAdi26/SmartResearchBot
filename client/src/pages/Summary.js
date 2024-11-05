// src/pages/Summary.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Summary = () => {
  const papers = [
    {
      id: 1,
      name: "Digital Art Innovations",
      pdfUrl: "https://example.com/path/to/research-paper1.pdf",
      description: "Exploring the latest advances in digital art techniques.",
      summary: "This paper explores new methodologies in digital media...",
      iconUrl: "https://example.com/path/to/icon1.png",
      gradientColor: "#0077b6",
    },
    {
      id: 2,
      name: "Art Movements Through History",
      pdfUrl: "https://example.com/path/to/research-paper2.pdf",
      description: "A review of significant art movements from Renaissance to Modernism.",
      summary: "This research covers key art movements and their impact on society...",
      iconUrl: "https://example.com/path/to/icon2.png",
      gradientColor: "#3a86ff",
    },
    {
      id: 3,
      name: "Contemporary Art Forms",
      pdfUrl: "https://example.com/path/to/research-paper3.pdf",
      description: "Analyzing the latest trends in contemporary art.",
      summary: "The paper provides insights into current trends and prominent artists...",
      iconUrl: "https://example.com/path/to/icon3.png",
      gradientColor: "#8338ec",
    },
    {
      id: 4,
      name: "Art and Technology Integration",
      pdfUrl: "https://example.com/path/to/research-paper4.pdf",
      description: "Examining the intersection between art and technology.",
      summary: "The study focuses on technological advancements influencing art...",
      iconUrl: "https://example.com/path/to/icon4.png",
      gradientColor: "#ff006e",
    },
    {
      id: 5,
      name: "The Future of Art in Virtual Reality",
      pdfUrl: "https://example.com/path/to/research-paper5.pdf",
      description: "Investigating how virtual reality is shaping the art world.",
      summary: "This paper discusses the transformative potential of VR in art...",
      iconUrl: "https://example.com/path/to/icon5.png",
      gradientColor: "#f77f00",
    },
    {
      id: 6,
      name: "Sustainable Art Practices",
      pdfUrl: "https://example.com/path/to/research-paper6.pdf",
      description: "Exploring eco-friendly methods in art creation.",
      summary: "The research highlights sustainable materials and practices in art...",
      iconUrl: "https://example.com/path/to/icon6.png",
      gradientColor: "#d62839",
    },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Summary copied to clipboard!");
    }).catch((error) => {
      console.error("Error copying text: ", error);
    });
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Research Paper Summaries</h1>
      <div className="row">
        {papers.map((paper) => (
          <div className="col-12 col-md-4 mb-4" key={paper.id}>
            <div
              className="card h-100 shadow-sm d-flex flex-row align-items-center p-3"
              style={{
                backgroundColor: "#ffffff",
                color: "#333",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              {/* Top section with gradient color */}
              <div
                style={{
                  backgroundColor: paper.gradientColor,
                  height: "8px",
                  width: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              ></div>

              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <h5 className="card-title" style={{ color: "#333" }}>{paper.name}</h5>
                </div>
                <p className="card-text" style={{ color: "#666" }}>{paper.description}</p>
                <a 
                  href={paper.pdfUrl} 
                  className="btn btn-outline-primary mt-2 mb-2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </div>

              <div className="card-body d-flex flex-column align-items-start">
                <p className="card-text"><strong>Summary:</strong> {paper.summary}</p>
                <button
                  onClick={() => handleCopy(paper.summary)}
                  className="btn btn-sm btn-outline-secondary"
                  style={{ cursor: 'pointer' }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;

