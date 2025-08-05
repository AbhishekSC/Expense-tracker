// **Success response handler**
export const sendSuccessResponse = (
  res,
  statusCode,
  success,
  message,
  data,
  error = {}
) => {
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
    error: {},
  });
};

// **Error response handler**
export const sendErrorResponse = (
  res,
  statusCode,
  success,
  message,
  data,
  error
) => {
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
    error: error,
  });
};
