const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const userAuth = require("./routes/user_auth");
const user = require("./routes/user");

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

const db = require("./config/config").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

// Routes
app.use("/user_auth", userAuth);
app.use("/user", user);

const portNo = process.env.PORT || 5500;

app.listen(portNo, () => console.log(`Server started in ${portNo}`));
