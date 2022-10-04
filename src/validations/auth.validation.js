const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  //get token from request header
  const { authorization } = req.headers;
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (authorization && authorization.startsWith("Bearer")) {
    console.log("yes");
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({message:"Token invalid"});
      } else {
        req.user = user;
        next(); //proceed to the next action in the calling function
      }
    }); //end of jwt.verify()
  } else {
    console.log("not");
    return res.status(400).send({message:"Token not present"});
  }
}

module.exports = {
  validateToken,
};
