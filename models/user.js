var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const { string } = require("@hapi/joi");

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
  },
});
userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};


var userDetailsSchema = mongoose.Schema({
  cnic:String,
  userId:String,
});


var sellerDetailsSchema = mongoose.Schema({
  contact: String,
  storeName: String,
  sellerId : String
  
});

var builderDetailsSchema = mongoose.Schema({
  contact: String,
  companyName: String,
  builderId : String
});

var adminDetailschema = mongoose.Schema({
  hobby:String,
  adminId:String,
});




var User = mongoose.model("User", userSchema);
var UserDetails = mongoose.model("UserDetails", userDetailsSchema);
var SellerDetails = mongoose.model("SellerDetails", sellerDetailsSchema);
var BuilderDetails = mongoose.model("BuilderDetails", builderDetailsSchema);
var AdminDetails = mongoose.model("adminDetails", adminDetailschema);


//validate register
function validateRegister(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().min(4).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

//validate login
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.User = User;
module.exports.UserDetails = UserDetails;
module.exports.SellerDetails = SellerDetails;
module.exports.BuilderDetails = BuilderDetails;
module.exports.AdminDetails = AdminDetails;


module.exports.validateRegister = validateRegister;
module.exports.validateLogin = validateLogin;
