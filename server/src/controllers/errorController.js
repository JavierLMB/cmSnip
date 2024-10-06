import AppError from "../utils/appError.js";

// Handle MongoDB CastError
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle MongoDB Duplicate Key Error
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: '${value}'. Please use another value!`;
  return new AppError(message, 400);
};

// Handle MongoDB Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");

  const message = `Invalid input data. ${errors}`;
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
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// Export error handling middleware function
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === "ValidationError") error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError(error);

    if (error.name === "TokenExpiredError") error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
