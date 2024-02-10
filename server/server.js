import express, { response } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import Notification from "./Schema/Notification.js";
import Comment from "./Schema/Comment.js";
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

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
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


server.post("/change-password", vefifyJWT , (req, res)=>{
  let {currentPassword, newPassword} = req.body;

  if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
     return res.status(403).json({error :"Password should be 6 to 20 char long with a numeric , 1 lowercase and 1 upercase"})
 }

 User.findOne({_id: req.user }).then((user) => {
    if(user.google_auth){
         return res.status(403).json({error :"This account password can not be changed beacause it created via a googleauth"})
    }
    bcrypt.compare(currentPassword , user.personal_info.password , (err , result)=>{
      if(err) {
        return res.status(500).json({error :"Some error accured while changing the password"})
      }
      if(!result){
        return res.status(403).json({error : "Incorrect Password"})
      }
      bcrypt.hash(newPassword , 10 , (err , hashed_password)=>{
             User.findOneAndUpdate({_id:req.user} , {"personal_info.password": hashed_password}).then((u)=>{
                   return res.status(200).json({status: "password changed successfully"})
             }).catch(err => {
              return res.status(500).json( {error : "Some error occured while changing the password , please try agian latter"})
             })
      })
    })
 }).catch(err =>{
  console.log(err)
  res.status(500).json({error :"User not found"});
})

})

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
  let { tag, query, author, page, limit, eliminate_blog } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  let maxLimit = limit ? limit : 2;

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
  let { tag, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
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

server.post("/get-profile", (req, res) => {
  let { username } = req.body;
  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/update-profile-img" , vefifyJWT , (req , res) =>{
  let {url } = req.body;

  User.findOneAndUpdate({_id:req.user} , {"personal_info.profile_img":url }).then(()=>{
    return res.status(200).json({profile_img:url})
  }).catch(err => {
    return res.status(500) .json({error:err.message})
  })

})







// For Creating the post





server.post("/create-blog", vefifyJWT, (req, res) => {
  let authorId = req.user;
  let { title, des, banner, tags, content, draft, id } = req.body;

  if (!title?.length) {
    return res.status(403).json({ error: "You must provide a title" });
  }

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
  tags = tags.map((tag) => tag.toLowerCase());
  let blog_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, "-")
      .trim() + nanoid();
  console.log(blog_id);
  if (id) {
    Blog.findOneAndUpdate(
      { blog_id },
      { title, des, banner, content, tags, draft: draft ? draft : false }
    )
      .then(() => {
        return res.status(200).json({ id: blog_id });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Error while editing" });
      });
  } else {
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
            return res.status(500).json({ error: "problem before the end" });
          });
      })
      .catch((error) => {
        return res.status(500).json({ error: "Problem at the end" });
      });
  }
});

server.post("/get-blog", (req, res) => {
  let { blog_id, draft, mode } = req.body;

  let incrementval = mode != "edit" ? 1 : 0;
  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementval } }
  )
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .select("title  des content activity publishedAt blog_id tags banner")
    .then((blog) => {
      User.findOneAndUpdate(
        {
          "personal_info.username": blog.author.personal_info.username,
        },
        {
          $inc: { "account_info.total_reads": incrementval },
        }
      ).catch((err) => {
        return res.status(500).json({ error: err.message });
      });

      if (blog.draft && !draft) {
        return res.status(500).json({ error: "you can not access draft blog" });
      }
      return res.status(200).json({ blog });
    })
    .catch((err) => {
        return res.status(500).json({ error: err.message});
    });
});

server.post("/like-blog", vefifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id, islikedbyuser } = req.body;

  let incrementalVal = !islikedbyuser ? 1 : -1;

  Blog.findOneAndUpdate(
    { _id },
    { $inc: { "activity.total_likes": incrementalVal } }
  ).then((blog) => {
    console.log(blog);
    if (!islikedbyuser) {
      let like = new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author || " ",
        user: user_id,
      });
      like.save().then((notification) => {
        return res.status(200).json({ liked_by_user: true });
      });
    } else {
      Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
        .then((data) => {
          return res.status(200).json({ liked_by_user: false });
        })
        .catch((err) => {
          return res.status(500).json({ err: err.message });
        });
    }
  });
});

server.post("/isliked-by-user", vefifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;
  Notification.exists({ user: user_id, type: "like", blog: _id })
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
});

server.post("/add-comment", vefifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id, comment, blog_author} = req.body;

  if (!comment.length) {
    return (
      res.status(403), json({ error: "Write something to leave a comment..." })
    );
  }
  let commentObj = new Comment({
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
  });

  commentObj.save().then((commentFile) => {
    let { comment, commentedAt, children } = commentFile;
    Blog.findOneAndUpdate(
      { _id },
      {
        $push: { "comments": commentFile._id },
        $inc: { "activity.total_comments": 1 },
        "activity.total_parent_comments": 1,
      }
    ).then((blog) => {
      console.log(blog + "Comments created");
    });
    let notificationObj = {
      type: "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };
    new Notification(notificationObj)
      .save()
      .then((notification) => console.log("New Notification Created"));
    return res.status(200).json({
      comment,
      commentedAt,
      _id: commentFile._id,
      user_id,
      children,
    });
  });
});

server.post("/get-blog-comments", (req, res) => {
  let { blog_id, skip } = req.body;

  let maxLimit = 5;

  Comment.find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username  personal_info.fullname personal_info.profile_img  "
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({
      commentedAt: -1,
    })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});




















server.listen(PORT, () => {
  console.log("Listening on " + PORT + "  wohooooo 😄😄👲👲");
});
