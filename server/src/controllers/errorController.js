import AppError from "../utils/appError.js";

// Handle MongoDB CastError
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle JWT Error
const handleJWTError = () => new AppError("Invalid token. Please log in again!", 401);

// Handle JWT Expired Error
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// Send error response in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// Send error response in production mode
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
  console.error("ERROR 💥", err);
};

// Export error handling middleware function
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);

    if (err.name === "JsonWebTokenError") err = handleJWTError(err);

    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

    sendErrorProd(err, res);
  }
};
