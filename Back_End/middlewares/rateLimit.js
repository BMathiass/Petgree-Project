const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // até 5 tentativas por IP
  message: "Muitas tentativas de login. Tente novamente em 5 minutos.",
  standardHeaders: true, // adiciona RateLimit-* nos headers de resposta
  legacyHeaders: false,
});

module.exports = loginLimiter;

