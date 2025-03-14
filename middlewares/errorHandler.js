//error middlware
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV == "development") {
    res.status(error.statusCode).json({
      success: false,
      status: error.statusCode,
      message: error.message,
      stack: error.stack,
      error: error,
    });
  }

  if (process.env.NODE_ENV == "production") {
    let message = error.message;
    let newError = new Error(message);

    if (error.code == 11000 && error.keyValue) {
      //const demail = error.keyValue.email;
      //let message = `Duplicate email : ${demail} error`;
      // let message = `Duplicate ${Object.keys(error.keyValue.email)} error`;
      const duplicateField = Object.keys(error.keyValue)[0]; //to get the field name
      console.log(duplicateField);
      const duplicateValue = error.keyValue[duplicateField]; // to get the duplicate value
      console.log(duplicateValue);

      message = `Duplicate ${duplicateField} : ${duplicateValue} error`;
      newError = new Error(message);
      newError.statusCode = 400;
    }
    if (error.name == "CastError") {
      let message = `Invalid ${error.path}`;
      newError = new Error(message);
      newError.statusCode = 400;
    }
    res.status(error.statusCode).json({
      success: false,
      message: newError.message || "internal server error",
    });
  }
};
