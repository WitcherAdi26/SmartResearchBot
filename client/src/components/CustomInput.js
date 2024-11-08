import React, { useState, useRef, useEffect } from 'react';
import './CustomInput.css';
import axios from 'axios';

function CustomChat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]); // Store chat messages
  const [isLoading, setIsLoading] = useState(false); // To show loading spinner
  const chatBoxRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  // Handle file selection and allow only PDFs
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setIsLoading(true); // Show loading spinner

        // Stop blinking for all previous files
        setChat((prevChat) => 
          prevChat.map((item) => 
            item.fileType === 'pdf' ? { ...item, blinking: false } : item
          )
        );

        // Add the new file with blinking effect
        setChat((prevChat) => [
          ...prevChat,
          { text: `File selected: ${file.name}`, sender: 'user', fileType: 'pdf', fileName: file.name, blinking: true }
        ]);

        // Make Requet here    
        let responseMessage="Something went wrong!";
        try {
          const formData = new FormData();
          formData.append("files", file); // 'files' matches the backend parameter name
    
          // const userId = 1; // Replace with the actual user ID
          const response = await axios.post(' http://127.0.0.1:8000/upload/1', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Accept':'application/json'
              }
          });

          alert("File Uploaded Succesfully.");
          if(response.status===200)responseMessage="What do you wish to know?";
        } catch (error) {
          console.error("Error uploading file:", error);
          responseMessage="Error uploading files.";
          alert("Failed to upload file. Please try again.");
        }

        setChat((prevChat) => [
          ...prevChat,
          { text: responseMessage, sender: 'model' } // Example model response
        ]);

        // Stop blinking after receiving the response
        setChat((prevChat) => 
          prevChat.map((item) => 
            item.fileType === 'pdf' && item.fileName === file.name ? { ...item, blinking: false } : item
          )
        );

        setIsLoading(false); // Hide loading spinner after 5 seconds
        // }, 5000); // Simulate 5 seconds delay for response
      } else {
        setChat([...chat, { text: 'Only PDF files are allowed.', sender: 'model' }]);
      }
    }
  };

  // Handle sending a message
  const handleSendMessage = async() => {
    if (message.trim()) {
      setChat([...chat, { text: message, sender: 'user' }]);
      setMessage(''); // Clear input after sending

      // Simulate a model response with a short delay

      // Make request here
      let responseMessage="";
      try {
        const response = await axios.post('http://127.0.0.1:8000/ask/1', {
          "question": message
        }, {
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            }
        });

        console.log(response.data);
        console.log(response.data.response.result);
        
        if(response.status===200)responseMessage=response.data.response.result;
      } catch (error) {
        console.log("Error Sending query : ",error);
        responseMessage="OOPs! Something went wrong.";
        alert("There was error sending query. Please retry now or sometime later.");
      }

      // setTimeout(() => {
      setChat((prevChat) => [
        ...prevChat,
        { text: responseMessage, sender: 'model' }
      ]);
      // }, 500);
    }
  };

  // Handle Enter key press for sending a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Chat area */}
      <div className="chat-box" ref={chatBoxRef}>
        {chat.map((item, index) => (
          <div
            key={index}
            className={`chat-bubble ${item.sender === 'user' ? 'user-message' : 'model-message'}`}
          >
            {item.text}
            {item.fileType === 'pdf' && (
              <div className={`pdf-info ${item.blinking ? 'blinking' : ''}`}>
                <span>📄 {item.fileName}</span> {/* PDF Icon and Name */}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="custom-input-container">
        {/* File attachment icon */}
        <label className="attachment-icon">
          📎
          <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>

        {/* Textarea input */}
        <textarea
          className="custom-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Loading spinner display */}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}

        {/* Send button */}
        <button className="send-button" onClick={handleSendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default CustomChat;
