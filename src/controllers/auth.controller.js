const httpStatus = require("http-status");
const { userService, companyService, teamService } = require("../services");
const { User, Company } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../utils/auth");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const ApiError = require("../utils/APIError");
const { createToken } = require("../services/notification.service");

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const signup = async (req, res, next) => {
  let { name, email, jobTitle, companyId, teamId } = req.body;
  function generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  const password = generatePassword();
  console.log("generatedPassword", password);
  console.log("companyId", companyId, req.body);
  let errors = [];
  email = email.toLowerCase();
  console.log(email);
  if (!name) {
    errors.push({ message: " Name Required" });
  }
  if (!email) {
    errors.push({ message: "Email Required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ message: "Email Invalid" });
  }
  if (!password) {
    errors.push({ message: "Password Required" });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        return res
          .status(422)
          .json({ errors: [{ message: "email already exists" }] });
      } else {
        const user = new User({
          name: name,
          email: email,
          password: password,
          companyId: companyId,
          jobTitle: jobTitle,
          teamId: teamId,
        });
        await bcrypt
          .hash(password, 10)
          .then((pass) => {
            user.password = pass;

            user
              .save()
              .then((response) => {
                const transport = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "shahud@plumtreegroup.net",
                    pass: "dqxlyxwlzbjzvofg",
                  },
                });

                const mailOptions = {
                  from: "shahud@plumtreegroup.net",
                  to: email,
                  subject: "First Time Login Credentials",
                  text: `
        <!doctype html>
        <html lang="en-US">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              Your First time login credentials are
                                              </p>
                                              <a href=#
                                              style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Email : ${email}</a>
                                              <a href=#    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Password : ${password}</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                         
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
        </body>
        </html>`,
                  html: `
                  <!doctype html>
                  <html lang="en-US">
                  <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                  </head>
                  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        Your First time login credentials are
                                                        </p>
                                                        <a href=#
                                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Email : ${email}</a>
                                                            <a href=#    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Password : ${password}</a>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                   
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                  </body>
                  </html>`,
                };

                transport.sendMail(mailOptions, async (error, info) => {
                  console.log("workingg");
                  const company = await companyService.getCompanyById(
                    response.companyId
                  );
                  const team = teamId
                    ? await teamService.getTeamById(response.teamId)
                    : null;
                  console.log(
                    "newCompany",
                    company.employeeId,
                    team.employeeId
                  );

                  const obj = {
                    employeeId: company.employeeId,
                  };
                  obj.employeeId.push(response.id);
                  const newCompany = await companyService.updateCompanyById(
                    response.companyId,
                    obj
                  );
                  const objTeam = {
                    employeeId: team.employeeId,
                  };
                  objTeam.employeeId.push(response.id);
                  const newTeam = await teamService.updateTeamById(
                    response.teamId,
                    objTeam
                  );

                  console.log("newCompany", newCompany,newTeam);

                  if (error) {
                    console.log(" not workingg", error);

                    return res
                      .status(400)
                      .json({ message: "Error Please try again" });
                  } else {
                    res.status(200).json({
                      success: true,
                      result: response,
                    });
                  }
                });
              })
              .catch((err) => {
                console.log("shahudd");
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          })
          .catch((err) => {
            console.log("shahud");
            res.status(500).json({
              errors: [{ error: err }],
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ message: "Something went wrong" }],
      });
    });
};
const signin = (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  console.log("detailll", req.body, email, password);
  let errors = [];
  if (!email) {
    console.log("S1");
    errors.push({ message: "email required" });
  }
  if (!emailRegexp.test(email)) {
    console.log("S2");

    errors.push({ message: "invalid email" });
  }
  if (!password) {
    console.log("S3");

    errors.push({ message: "password required" });
  }
  if (errors.length > 0) {
    console.log("S4");

    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("S5");

        return res.status(404).json({
          errors: [{ message: "User not found" }],
        });
      } else {
        console.log("S6");

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            console.log("working2");
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ message: "password incorrect" }] });
            }
            let access_token = createJWT(user.email);
            console.log(access_token);
            return res.status(200).json({
              success: true,
              token: access_token,
              message: user,
            });
          })
          .catch((err) => {
            res.status(500).json({ erros: err });
            console.log("err3");
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ erros: err });
      console.log("err4");
    });
};

const forgetPassword = async (req, res) => {
  var forgetCode = Math.floor(Math.random() * 9000) + 1000;
  var code = forgetCode.toString();
  code = code.split("").join(" ");
  console.log("code", code);
  const email = req.body.email.toLowerCase();
  console.log(email);
  try {
    if (email) {
      const isUser = await User.findOne({ email: email });
      console.log("if", isUser);

      if (isUser) {
        // generate token
        const secretKey = isUser._id + "Shahud";
        const token = jwt.sign({ userID: isUser._id }, secretKey, {
          expiresIn: 31536000,
        });
        console.log("working");

        // email sending
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "shahud@plumtreegroup.net",
            pass: "dqxlyxwlzbjzvofg",
          },
        });

        const mailOptions = {
          from: "shahud@plumtreegroup.net",
          to: email,
          subject: "Password Reset Request",
          text: `
<!doctype html>
<html lang="en-US">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <title>Reset Password Email Template</title>
  <meta name="description" content="Reset Password Email Template.">
  <style type="text/css">
      a:hover {text-decoration: underline !important;}
  </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
  <!--100% body table-->
  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
      style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
      <tr>
          <td>
              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                  align="center" cellpadding="0" cellspacing="0">
                  
                  <tr>
                      <td>
                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                              style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="padding:0 35px;">
                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                          requested to reset your password</h1>
                                      <span
                                          style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                      Your code for resetting your password is
                                      </p>
                                      <a href=#
                                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${code}</a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                 
              </table>
          </td>
      </tr>
  </table>
  <!--/100% body table-->
</body>
</html>`,
          html: `
          <!doctype html>
          <html lang="en-US">
          <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
          </head>
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Your code for resetting your password is
                                                </p>
                                                <a href=#
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${code}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                           
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
          </body>
          </html>`,
        };

        transport.sendMail(mailOptions, (error, info) => {
          console.log("workingg");

          if (error) {
            console.log(" not workingg", error);

            return res.status(400).json({ message: "Error" });
          }
        });
      } else {
        console.log("else");

        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      isUser.forgetCode = forgetCode;
      const result = await userService.updateUserById(isUser._id, isUser);
      return res.send(result);
    } else {
      return res.status(400).json({ message: "email is required" });
    }
  } catch (error) {
    console.log(" not working");

    return res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  const isUser = await User.findOne({ email: email });
  try {
    if (newPassword === confirmPassword) {
      bcrypt
        .compare(newPassword, isUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            return res.status(400).json({
              errors: [{ message: "You should try something deiffent" }],
            });
          }
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, async function (err, hash) {
              if (err) throw err;
              isUser.password = hash;
              const result = await userService.updateUserById(
                isUser._id,
                isUser
              );
              return res.status(200).json({
                message: "password Changed Successfully",
                user: result,
              });
            });
          });
        })

        .catch((err) => {
          res.status(500).json({ erros: err });
          console.log("err3");
        });
    } else {
      return res
        .status(400)
        .json({ message: "password and confirm password does not match" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const signupCompany = async (req, res) => {
  let { email, password, password_confirmation } = req.body;
  console.log("companySingup", req.body);
  let errors = [];
  email = email.toLowerCase();
  console.log(email);

  if (!email) {
    errors.push({ message: "Email Required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ message: "Email Invalid" });
  }
  if (!password) {
    errors.push({ message: "Password Required" });
  }
  if (!password_confirmation) {
    errors.push({
      message: "confirm password required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ message: "Password Mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  Company.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        return res
          .status(422)
          .json({ errors: [{ message: "email already exists" }] });
      } else {
        const user = new Company({
          email: email,
          password: password,
        });
        await bcrypt
          .hash(password, 10)
          .then((pass) => {
            user.password = pass;

            user
              .save()
              .then(async (response) => {
                console.log("response.id", response.id);
                const token = {
                  companyId: response.id,
                  token: [],
                };
                await createToken(token);
                res.status(200).json({
                  success: true,
                  result: response,
                });
              })
              .catch((err) => {
                console.log("shahudd");
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          })
          .catch((err) => {
            console.log("shahud");
            res.status(500).json({
              errors: [{ error: err }],
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ message: "Something went wrong" }],
      });
    });
};

const signinCompany = (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  console.log("detailll", req.body, email, password);
  let errors = [];
  if (!email) {
    console.log("S1");
    errors.push({ message: "email required" });
  }
  if (!emailRegexp.test(email)) {
    console.log("S2");

    errors.push({ message: "invalid email" });
  }
  if (!password) {
    console.log("S3");

    errors.push({ message: "password required" });
  }
  if (errors.length > 0) {
    console.log("S4");

    return res.status(422).json({ errors: errors });
  }
  Company.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("S5");

        return res.status(404).json({
          errors: [{ message: "User not found" }],
        });
      } else {
        console.log("S6");

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            console.log("working2");
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ message: "password incorrect" }] });
            }
            let access_token = createJWT(user.email);
            console.log(access_token);
            return res.status(200).json({
              success: true,
              token: access_token,
              message: user,
            });
          })
          .catch((err) => {
            res.status(500).json({ erros: err });
            console.log("err3");
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ erros: err });
      console.log("err4");
    });
};

const forgetPasswordCompany = async (req, res) => {
  var forgetCode = Math.floor(Math.random() * 9000) + 1000;
  var code = forgetCode.toString();
  code = code.split("").join(" ");
  console.log("code", code);
  const email = req.body.email.toLowerCase();
  console.log(email);
  try {
    if (email) {
      const isUser = await Company.findOne({ email: email });
      if (isUser) {
        // generate token
        const secretKey = isUser._id + "Shahud";
        const token = jwt.sign({ userID: isUser._id }, secretKey, {
          expiresIn: 31536000,
        });
        console.log("working");

        // email sending
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "shahud@plumtreegroup.net",
            pass: "dqxlyxwlzbjzvofg",
          },
        });

        const mailOptions = {
          from: "shahud@plumtreegroup.net",
          to: email,
          subject: "Password Reset Request",
          text: `
<!doctype html>
<html lang="en-US">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <title>Reset Password Email Template</title>
  <meta name="description" content="Reset Password Email Template.">
  <style type="text/css">
      a:hover {text-decoration: underline !important;}
  </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
  <!--100% body table-->
  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
      style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
      <tr>
          <td>
              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                  align="center" cellpadding="0" cellspacing="0">
                  
                  <tr>
                      <td>
                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                              style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="padding:0 35px;">
                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                          requested to reset your password</h1>
                                      <span
                                          style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                      Your code for resetting your password is
                                      </p>
                                      <a href=#
                                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${code}</a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                 
              </table>
          </td>
      </tr>
  </table>
  <!--/100% body table-->
</body>
</html>`,
          html: `
          <!doctype html>
          <html lang="en-US">
          <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
          </head>
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Your code for resetting your password is
                                                </p>
                                                <a href=#
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${code}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                           
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
          </body>
          </html>`,
        };

        transport.sendMail(mailOptions, (error, info) => {
          console.log("workingg");

          if (error) {
            console.log(" not workingg", error);

            return res.status(400).json({ errors: [{ message: "Error" }] });
          }
        });
      } else {
        return res.status(400).json({ errors: [{ message: "Invalid Email" }] });
      }

      isUser.forgetCode = forgetCode;
      const result = await companyService.updateCompanyById(isUser._id, isUser);
      return res.send(result);
    } else {
      return res
        .status(400)
        .json({ errors: [{ message: "email is required" }] });
    }
  } catch (error) {
    console.log(" not working");

    return res.status(400).json({ errors: [{ message: error.message }] });
  }
};

const changePasswordCompany = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  const isUser = await Company.findOne({ email: email });
  console.log("passssss", newPassword, isUser.password);
  try {
    if (newPassword === confirmPassword) {
      bcrypt
        .compare(newPassword, isUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            return res.status(400).json({
              errors: [{ message: "You should try something deiffent" }],
            });
          }
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, function (err, hash) {
              if (err) throw err;
              isUser.password = hash;
            });
          });
          const result = await companyService.updateCompanyById(
            isUser._id,
            isUser
          );
          return res
            .status(200)
            .json({ message: "password Changed Successfully", user: result });
        })

        .catch((err) => {
          res.status(500).json({ errors: err });
          console.log("err3");
        });
    } else {
      return res.status(400).json({
        errors: [{ message: "password and confirm password does not match" }],
      });
    }
  } catch (error) {
    return res.status(400).json({ errors: [{ message: error.message }] });
  }
};

const forgetCode = (req, res) => {
  let { code, email } = req.body;
  email = email.toLowerCase();
  console.log("detailll", req.body);

  Company.findOne({ email: email })
    .then((user) => {
      console.log("checkingg", user, code !== user.forgetCode);
      if (!user || code !== user.forgetCode) {
        console.log("S5");

        return res.status(404).json({
          errors: [{ message: "Incorrect Code" }],
        });
      } else {
        console.log("S6");

        return res.status(200).json({
          success: true,
          message: "Correct Code",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
      console.log("err4");
    });
};

module.exports = {
  signin,
  signup,
  forgetPassword,
  changePassword,
  signinCompany,
  signupCompany,
  forgetPasswordCompany,
  changePasswordCompany,
  forgetCode,
};
