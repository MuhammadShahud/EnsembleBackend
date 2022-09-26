const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.createJWT = (email, userId, duration) => {
      console.log("JWT");
      const secret = config.jwt.secret

   const payload = {
      email,
      userId,
      duration
   };
   return jwt.sign(
    payload, secret, {
     expiresIn: duration,
   });
};
const generateToken = (
      userId,
      userRole,
      expires,
      type,
      secret = config.jwt.secret
    ) => {
      const payload = {
        sub: userId,
        role: userRole,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
      };
      return jwt.sign(payload, secret);
    };
// const token = jwt.sign(
//       { user_id: user._id, email },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );