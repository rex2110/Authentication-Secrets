const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/usersDB", {
  useNewUrlParser: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
var secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (err) console.log(err);
      else res.render("secrets");
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.username;
    const pass = req.body.password;
    User.findOne({ email: email}, (err, foundUser) => {
      if(err) console.log(err);
      else{
        if(foundUser.password === pass){
            res.render("secrets");
        }
      }
    });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
