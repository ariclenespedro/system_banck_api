const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
  
        if (!token) {
          return res.status(401).json({ message: "Acesso negado" });
        }
  
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
      } catch (error) {
        res.status(400).json({ message: "Token Inválido!" });
      }
};
