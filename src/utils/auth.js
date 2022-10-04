const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.createJWT = (email) => {
      console.log("JWT");
console.log(email,process.env.ACCESS_TOKEN_SECRET)
     const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "365d"}) 
console.log('token',token);
     return token
};

// const token = jwt.sign(
//       { user_id: user._id, email },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );