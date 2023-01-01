import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import postRouter from "./routes/postRoute.js";
import authRouter from "./routes/auth.js";

//To get the path of our build folder and index.html inside heroku we need path and url
import path from "path";
import { fileURLToPath } from "url";

//First we will get the name of the current file that is server.js
const __filename = fileURLToPath(import.meta.url);

//Then we will get the current directory name that is react-blog-app
const __dirname = path.dirname(__filename);
console.log("File name and directory name", __dirname, __filename);

const app = express();
dotenv.config();

app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());

//serving the static files using express.static- if we want some images or files accessible
//to the user from backend we need to declare them as static
//realtive path to the build folder from server.js - "../build"

//If we wnat to share a file or image or js from our backend to front end then we need to decalre that folder that is containing
//specific files as static.  For the reason we are using express.static
app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/auth", authRouter);
app.use("/posts", postRouter);

//app.use("/categories", categoryRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
const port = process.env.PORT;

//Global error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      msg: error.message,
    },
  });
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port : ${port}`);
    });
  })
  .catch((err) => {
    console.log(`${err.message} - did not connect`);
  });
