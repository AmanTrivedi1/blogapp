import express, { response } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import serviceAccount from "./blogapp-bdcc8-firebase-adminsdk-4ypai-c44e56c9da.json" assert { type: "json" };
import aws from "aws-sdk";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());
server.use(cors());
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// Setting up S3 bucket

const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "writeblogapp",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

// Verify the user login or not via JWT access token

const vefifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token not valid" });
    }
    req.user = user.id;
    next();
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
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

//Upload image url Route
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

// Sign up Part is here
server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname?.length < 3) {
    return res.status(403).json({ error: "Name must be atleast 3 letters " });
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

//Singin part will goes here

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ status: "Error accured while login (try again)" });
          }
          if (!result) {
            return res.status(403).json({ status: "Incorrect Password" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({
          status: "Account was Created via Google try to login via a google",
        });
      }

      console.log(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;
  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      picture = picture.replace("s96-c", "s384-c");
      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username , personal_info.profile_img  google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          returnres.status(500).Json({ error: err.message });
        });

      if (user) {
        if (!user.google_auth) {
          return res
            .status(403)
            .json({ error: "Please Signin without google" });
        }
      } else {
        let username = await generateUsername(email);
        user = new User({
          personal_info: {
            fullname: name,
            email,
            username,
          },
          google_auth: true,
        });
        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to Authenticate" });
    });
});

// For getting the all blogs post

server.post("/latest-blogs", (req, res) => {
  let { page } = req.body;
  let maxLimit = 5;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img , personal_info.username , personal_info.fullname , -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.get("/trending-blogs", (req, res) => {
  let maxLimit = 5;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img , personal_info.username , personal_info.fullname , -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id  title publishedAt -_id")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

//  Get the blog by category search functionality

server.post("/search-blogs", (req, res) => {
  let { tag, query, page } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  }

  let maxLimit = 2;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img , personal_info.username , personal_info.fullname , -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/search-blogs-count", (req, res) => {
  let { tag, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  }

  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

server.post("/search-users", (req, res) => {
  let { query } = req.body;

  User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(50)
    .select(
      "personal_info.fullname personal_info.username , personal_info.profile_img , -_id "
    )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// For Creating the post

server.post("/create-blog", vefifyJWT, (req, res) => {
  let authorId = req.user;
  let { title, des, banner, tags, content, draft } = req.body;

  if (!draft) {
    if (!des?.length || des?.length > 200) {
      return res
        .status(403)
        .json({ error: "You must provide description under 200 char" });
    }
    if (!banner?.length) {
      return res.status(403).json({ error: "You must provide a blog banner" });
    }
    if (!content?.blocks.length) {
      return res
        .status(403)
        .json({ error: "You must provide some content to publish" });
    }
    if (!tags.length) {
      return res
        .status(403)
        .json({ error: "You Should provides some tags under limit 10" });
    }
  }

  if (!title?.length) {
    return res.status(403).json({ error: "You must provide a title" });
  }
  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();
  console.log(blog_id);

  let blog = new Blog({
    title,
    des,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementval = draft ? 0 : 1;

      User.findOneAndUpdate(
        {
          _id: authorId,
        },
        {
          $inc: { "account_info.total_posts": incrementval },
          $push: {
            blogs: blog._id,
          },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((error) => {
          return res.status(500).json({ error: "Failed to updated post" });
        });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

// acess token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGZkNTE4ZDU2NTg1NGNjMzA0ZDNiYiIsImlhdCI6MTY5OTczMDcxMn0.uZWmwu9ET9g2Pfvt-XfIq827Vg0vJuNXT_d3exDsVa8
server.listen(PORT, () => {
  console.log("Listening on port wohooooo😄 ->", +PORT);
});
