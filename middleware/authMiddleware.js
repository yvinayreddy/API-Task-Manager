const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
 
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user id to request
      req.user = decoded.id;

      // Allow request to continue
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
