export const errorHandle = (res, error, code = 500) => {
  const errormessage = error.message ? error.message : error;
  return res.status(code).json({
    statusCode: code,
    message: error.message || "Internal server error",
  });
};
