const express = require('express');
const router = express.Router();

// Import controllers
// const { 
//   processMessage, 
//   getHistory 
// } = require('../controllers/chatbotController');

// Define routes
// Process chatbot message
router.post('/message', (req, res) => {
  res.json({ success: true, message: 'Process chatbot message route' });
});

// Get chat history
router.get('/history/:sessionId', (req, res) => {
  res.json({ success: true, message: `Get chat history for session ${req.params.sessionId}` });
});

module.exports = router;