// Mencetak method dan URL tiap request
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// Melindungi route dengan token di header
function requireAuth(req, res, next) {
  const token = req.headers["x-auth-token"];

  if (token !== "secret123") {
    return res
      .status(401)
      .json({ error: "Unauthorized: missing or invalid token" });
  }

  next();
}

// Dijalankan kalau tidak ada route yang cocok
function notFound(req, res, next) {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
}

// Error handler: WAJIB 4 parameter, dan ditaruh paling akhir
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
}

module.exports = { logger, requireAuth, notFound, errorHandler };
