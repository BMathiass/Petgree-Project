const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // até 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas tentativas de login. Tente novamente em 5 minutos."
    });
  }
});

module.exports = loginLimiter;