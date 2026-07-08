// Catches errors thrown/passed via next(err) from any route
function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  // MySQL duplicate entry (e.g. email already registered)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

// Catches requests to routes that don't exist
function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

module.exports = { errorHandler, notFound };