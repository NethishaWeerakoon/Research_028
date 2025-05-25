const jwt = require("jsonwebtoken");

// Middleware to authenticate and attach user to request
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = { id: decoded.id }; // Attach user ID to the request
    next();
  } catch (err) {
    res.status(403).json({ error: "Token is invalid or expired" });
  }
};

module.exports = authenticateUser;
