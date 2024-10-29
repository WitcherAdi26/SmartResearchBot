import React, { useState, useRef } from 'react';
import './CustomInput.css';

function CustomInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null); // Create a ref for the textarea

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    setMessage(''); // Clear the input after sending
    textareaRef.current.style.height = 'auto'; // Reset height when clearing
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleSendMessage(); // Call send message on Enter key
    }
  };

  const handleInput = () => {
    textareaRef.current.style.height = 'auto'; // Reset height to get the scroll height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
  };

  return (
    <div className="custom-input-container">
      {/* File input for attachment */}
      <label className="attachment-icon">
        📎
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      </label>

      {/* Message input as a textarea */}
      <textarea
        ref={textareaRef} // Attach the ref to the textarea
        placeholder="Ask for Summary"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleInput} // Handle input to adjust height
        className="custom-input"
        rows={1} // Start with one row
        onKeyDown={handleKeyDown} // Handle key down event
      />

      {/* Send button */}
      <button className="send-button" onClick={handleSendMessage}>
        ➤
      </button>
    </div>
  );
}

export default CustomInput;
