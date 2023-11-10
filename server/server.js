import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

const formatDatatoSend = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);
  ("");
  isUsernameNotUnique ? (username += nanoid().substring(0, 4)) : "";
  return username;
};

server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname?.length < 3) {
    return res.status(403).json({ error: "Name must be > 3 letters " });
  }
  if (!email?.length) {
    return res.status(403).json({ error: "Enter Email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 char long with numeric , 1 lowercase letter  & 1 Uppercase letter ",
    });
  }
  bcrypt.hash(password, 10, async (err, hashe_password) => {
    let username = await generateUsername(email);

    let user = new User({
      personal_info: { fullname, email, password: hashe_password, username },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "Email already Exists" });
        }
        return res.status(500).json({ error: err.message });
      });

    console.log(hashe_password);
  });
  // return res.status(200).json({ status: "ok" });
});

server.listen(PORT, () => {
  console.log("Listening on port ->", +PORT);
});
