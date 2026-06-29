const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");

    // 🔥 IMPORTANT FIX HERE
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/*const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}; */