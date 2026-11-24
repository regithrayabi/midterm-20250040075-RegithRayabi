// Membuat error dengan status code
function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Mencetak method dan URL tiap request
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// Melindungi route dengan token di header
function requireAuth(req, res, next) {
  if (req.headers["x-auth-token"] !== "secret123") {
    return next(createError(401, "Unauthorized: missing or invalid token"));
  }
  next();
}

// Dijalankan kalau tidak ada route yang cocok
function notFound(req, res, next) {
  next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

// Semua error berakhir di sini: WAJIB 4 parameter, dan ditaruh paling akhir
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ status, error: err.message });
}

module.exports = { createError, logger, requireAuth, notFound, errorHandler };
