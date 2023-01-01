import express from "express";
import UserMessages from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  forgotPassword,
  logout,
  resetPassword,
} from "../controller/authController.js";

const router = express.Router();

//REgister
router.post("/register", async (req, res, next) => {
  //const salt = await bcrypt.genSalt(10);
  //const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = await new UserMessages({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
  });
  const user = await newUser.save();
  //creating the jwt token
  const payload = {
    id: user._id,
    username: user.username,
  };

  jwt.sign(
    payload,
    `${process.env.JWT_SECRET}`,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) throw err;
      res
        .status(200)
        .json({ token, status: "Success", msg: "User Registered" });
    }
  );
  next();
});

//Login
router.post("/login", async (req, res, next) => {
  console.log("Hi Here");

  //console.log(req.body);
  try {
    const { email } = req.body;
    const user = await UserMessages.findOne({ email });
    //console.log(user);
    if (!user) {
      return res.status(400).json("Wrong Credentials!!!");
    }
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(400).json("Wrong Credentials!!!");
    }
    const payload = {
      email,
      username: user.username,
    };

    const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: "1h",
    });
    //const { password, ...others } = user._doc;
    //if the user is success
    res.status(200).json({
      status: "success",
      data: {
        email: user.email,
        username: user.username,
        //photo: user.photo,
        token,
      },
    });
    next();
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

export default router;
