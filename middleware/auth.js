const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Access denied, No token Provided.");

  try {
    //here will verfiy if the given token is true
    //will decode the token and return te payload of it 
    // so last thing we sent the decoded data inside the user of req  'no need to define user variable in req just callde it and it will define automatically'    
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token.");
  }
};
