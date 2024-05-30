const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "hvdvayui79{]uevduyou2p38";
app.use(express.json());
app.use(cors());

const mongoUrl = "mongodb+srv://admin:1234@cluster0.prsd2ce.mongodb.net/";
mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => { console.log("Connected to Database"); })
  .catch((e) => console.log(e));

const UserDetailsSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
}, {
  collection: "UserInfo",
});
mongoose.model("UserInfo", UserDetailsSchema);

const User = mongoose.model("UserInfo");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhadriir@gmail.com',
    pass: 'lrqo ujlm zmhy aiyh'
  }
});

// Register route
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User Exists" });
    }

    const newUser = await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });

    const mailOptions = {
      from: 'bhadriir@gmail.com',
      to: email,
      subject: 'Registration Successful',
      text: `Hello ${fname},\n\nThank you for registering with us!`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('Failed to send email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.send({ status: "Ok" });
  } catch (error) {
    console.error('Error occurred during registration:', error);
    res.send({ status: "error" });
  }
});

// Login route
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not Found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    return res.json({ status: "ok", data: token });
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// UserData route
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);
    const useremail = user.email;
    User.findOne({ email: useremail }).then((data) => {
      res.send({ status: "ok", data: data });
    }).catch((error) => {
      res.send({ status: "error", data: error });
    });
  } catch (error) {
    console.error('Error occurred during user data retrieval:', error);
    res.send({ status: "error", data: error });
  }
});

app.listen(5008, () => {
  console.log('Server Started');
});


