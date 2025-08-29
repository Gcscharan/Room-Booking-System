import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate a session ID for this chat session
  useEffect(() => {
    if (!localStorage.getItem('chatSessionId')) {
      localStorage.setItem('chatSessionId', `session_${Date.now()}`);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const sessionId = localStorage.getItem('chatSessionId');
      const response = await api.post('/api/chatbot/message', {
        message: input,
        sessionId,
      });

      setTimeout(() => {
        setIsTyping(false);
        if (response.data && response.data.reply) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: response.data.reply,
              sender: 'bot',
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          throw new Error('Invalid response format');
        }
      }, 500); // Simulate typing delay
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setIsTyping(false);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again later.';
      
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        if (error.response.status === 429) {
          errorMessage = 'You\'ve sent too many messages. Please wait a moment and try again.';
        } else if (error.response.status === 500) {
          errorMessage = 'The server encountered an error. Our team has been notified.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Cannot reach the server. Please check your internet connection.';
      } else if (error.message === 'Invalid response format') {
        errorMessage = 'Received an invalid response. Please try again.';
      }
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
      </button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3>Room Booking Assistant</h3>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hello! I'm your room booking assistant. How can I help you today?</p>
                <div className="suggestion-chips">
                  <button onClick={() => setInput('Show available rooms')}>Available rooms</button>
                  <button onClick={() => setInput('How do I book a room?')}>How to book</button>
                  <button onClick={() => setInput('Cancel my booking')}>Cancel booking</button>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button type="submit">
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;