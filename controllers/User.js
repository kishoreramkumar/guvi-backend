const User = require("../models/user");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  loginUser: (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json({ message: "Given details is not Valid" });
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          jwt.sign(
            payload,
            config.secretKey,
            {
              expiresIn: 3 * 24 * 60 * 60, // 3days
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Password incorrect" });
        }
      });
    });
  },
  registerUser: (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Given user details is not valid" });
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).json({ message: "Email already exists" });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => res.json(user))
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: err });
      });
  },
  getUserDetails: (req, res) => {
    let email = "";
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, config.secretKey);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      email = decoded.email;
    }

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          return res.json(user);
        } else {
          return res.status(400).json({ message: "Email already exists" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: "Internal Server Error" });
      });
  },
  setUserDetails: (req, res) => {
    let userDetail = {
      ...req.body,
    };
    let email = "";
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, config.secretKey);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      email = decoded.email;
    }

    User.findOneAndUpdate({ email: email }, { $set: userDetail }, { new: true })
      .then((user) => {
        if (user) {
          res.json(user);
        } else {
          req.status(400).json({ message: "Profile Update Failed" });
        }
      })
      .catch((err) =>
        req.status(400).json({ message: "Profile Update Failed" })
      );
  },
};
