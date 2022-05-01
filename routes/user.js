const express = require("express");
const router = express.Router();
const passport = require("passport");

const { getUserDetails, setUserDetails } = require("../controllers/User");

router.get(
  "/getDetails",
  passport.authenticate("jwt", { session: false }),
  getUserDetails
);

router.post(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  setUserDetails
);

module.exports = router;
