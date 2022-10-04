const mongoose = require('mongoose');
const { roles } = require('../config/roles');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    name:{
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   forgetCode: {
    type: Number,
    required: false

   }
  },
  {
    timestaps: true,
  },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);



/**
 * @typedef User
 */

const User = mongoose.model('user', userSchema);
module.exports = User;
