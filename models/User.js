import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = mongoose.Schema({
  username: { type: String, required: [true, "Please provide a username"] },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 5,
    //select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    //creating custom validator, it only works on create and save, so whenever we update our admin data we need to use save also! not with getbyidandupdate!
    validate: {
      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: "Passwords are not the same.",
    },
  },
  photo: { type: String },

  // added for protectController
  passwordChangedAt: Date,

  // added for reseting the password
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//pre save middleware from mongoose, for encrypting the passwords before saving it into db

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // we set passwordconfirm to undefined because we dont want to have passwordConfirm in our database, it is only for confirmation of the password after it is modified
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//! adding instance method for using in protectController
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // this keyword here points to current document, so we have access to all properties
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
  // by default we are returning false, means user has not changed his password after it was issued
};

userSchema.methods.createPasswordResetToken = function () {
  // since it doesnt need to be too strong so we use bytes function from the built in crypto module.
  const resetToken = crypto.randomBytes(32).toString("hex");

  // here like our password, we are encrypting this resetToken before saving it into our DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  //in order to save it to DB we created new field in our Model as "passwordResetToken" and assigned the encrypted token to that field.

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // we set the expiration time as 10 minutes

  // after setting values to that fields in our DB, we are sending plain token too the user, so we return resetToken.
  console.log(this.passwordResetExpires, this.passwordResetToken);
  return resetToken;
};

const UserMessages = mongoose.model("user", userSchema);

export default UserMessages;
