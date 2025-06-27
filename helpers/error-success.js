export const handleError = (res, error, code = 500) => {
  const message = error.message ? error.message : error;
  return res.status(code).json({
    statusCode: code,
    message: message || "Internal Server Error",
  });
};
export const succesMessage = (res, resdata, code = 200) => {
  return res.status(code).json({
    statusCode: code,
    message: "succes",
    data: resdata || null,
  });
};
