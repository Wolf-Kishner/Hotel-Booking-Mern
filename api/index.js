const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Places");
require("dotenv").config();
const imageDownloader = require("image-downloader");
const Booking = require("./models/Booking");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "acascqwqw21qwsa";
const port = process.env.PORT || 4000 ;  // Corrected JWT secret

//Using this Middleware we can display the links as Photos
app.use(express.json());  // Middleware to Parese JSON 
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);


// 5JYC9lClACBcKOcA
mongoose
  .connect(
    "mongodb+srv://vedant8kulkarni:5JYC9lClACBcKOcA@cluster0.cdkjkg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error("Something went wrong", error));

app.get("/test", (req, res) => {
  res.json("Test Ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            res.status(500).json("Error signing JWT");
          } else {
            res.cookie("token", token).json(userDoc);
          }
        }
      );
    } else {
      res.status(422).json("Pass Not ok");
    }
  } else {
    res.json("NotFound");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
//Max count of files is 100
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    //We want to rename the Files also each file contains an extension "filename.extension"
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos: addedPhotos,
    description,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    perks,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      perks,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    photos: addedPhotos,
    description,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    perks,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        perks,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const { 
    checkIn,
    checkOut,
    mobile,
    guests,
    price ,
    fullname,
    place,
  } = req.body;
  Booking.create({
    checkIn,
    checkOut,
    mobile,
    guests,
    price ,
    fullname,
    place,
    user : userData._id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
     throw err;
  })
});

//Funtion to verify the Token and  send Response 
function getUserDataFromToken (req) {
  return new Promise((resolve ,reject) => {
    jwt.verify(req.cookies.token,jwtSecret,{},async (err,userData)=> {
      if(err) throw err;
      resolve(userData);
    })
  })
}

app.get("/bookings" , async (req,res) => {
   const userData = await getUserDataFromToken(req);
   res.json( await Booking.find({
           user: userData._id ,
   }).populate('place'))
})

app.post("/search", async (req, res) => {
  const { search } = req.body;
  try {
    const places = await Place.find({ address: { $regex: search, $options: "i" } });
    res.json(places);
  } catch (err) {
    console.error("Error searching places:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log("Server is running on port 4000"); // Corrected port number
});
