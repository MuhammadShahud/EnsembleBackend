const httpStatus = require("http-status");
const { authService, tokenService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { User } = require('../models/index')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createJWT,
} = require("../utils/auth");
const config = require("../config/config");


const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


const login = catchAsync(async (req, res, next) => {
  const { orderId, token } = req.body;
  console.log(req.body)
  const user = await authService.loginUserWithEmailAndPassword(orderId, token);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const signup = (req, res, next) => {
  let { name, email, password, password_confirmation } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ name: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
 User.findOne({email: email})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "email already exists" }] });
       }else {
         const user = new User({
           name: name,
           email: email,
           password: password,
         });
 bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
         if (err) throw err;
         user.password = hash;
         user.save()
             .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
  })
}
const signin = (req, res) => {
     let { email, password } = req.body;
     console.log("detailll",req.body,email,password)
     let errors = [];
     if (!email) {
      console.log("S1");
       errors.push({ email: "required" });
     }
     if (!emailRegexp.test(email)) {
      console.log("S2");

       errors.push({ email: "invalid email" });
     }
     if (!password) {
      console.log("S3");

       errors.push({ passowrd: "required" });
     }
     if (errors.length > 0) {
      console.log("S4");

      return res.status(422).json({ errors: errors });
     }
     User.findOne({ email: email }).then(user => {
        if (!user) {
          console.log("S5");

          return res.status(404).json({

            errors: [{ user: "not found" }],
          });
        } else {
          console.log("S6");

           bcrypt.compare(password, user.password).then(isMatch => {
            console.log("working2");
              if (!isMatch) {
               return res.status(400).json({ errors: [{ password:
"incorrect" }] 
               });
              }
       let access_token = createJWT(
          user.email,
          user._id,
          31536000
       );
       jwt.verify(access_token, config.jwt.secret, (err,
decoded) => {
         if (err) {
            res.status(500).json({ erros: err });
            console.log("err");
         }
         if (decoded) {
             return res.status(200).json({
                success: true,
                token: access_token,
                message: user
             });
             console.log("working");

           }
         });
        }).catch(err => {
          res.status(500).json({ erros: err });
          console.log("err3");

        });
      }
   }).catch(err => {
      res.status(500).json({ erros: err });
      console.log("err4");

   });
}

module.exports = {
  login,
  signin,
  signup
};


