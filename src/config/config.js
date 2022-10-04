const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');

dotenv.config({path: path.join(__dirname, '../../.env')});

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app',
    ),
  })
  .unknown();

const {value: envVars, error} = envVarSchema
  .prefs({errors: {label: 'key'}})
  .validate(process.env);

if (error) {
  throw new Error(`Config Validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url:envVars.MONGODB_URL,
       options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

};
