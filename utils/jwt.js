const sendToken = (user, statusCode, res) => {
  //Creating JWT Token
  const token = user.getJwtToken();

  //setting cookies - will expires in 7 days in milliseconds
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //cant be accessed by js
  };
  res.cookie("token", token, options);
  res
    .status(statusCode)

    .json({
      success: true,
      token,
      user,
    });
};

module.exports = sendToken;
