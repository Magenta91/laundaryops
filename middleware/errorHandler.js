const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  
  // Handle specific error types
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  
  // Default to 500 server error
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
