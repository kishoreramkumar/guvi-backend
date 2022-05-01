const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female", "others"],
  },
  age: { type: Number, required: false },
  dob: {
    type: Date,
    required: false,
  },
  mobile: {
    type: Number,
    required: false,
    validate: {
      validator: function (v) {
        return /d{10}/.test(v);
      },
      message: "Mobile no is not a valid 10 digit number!",
    },
  },
});

module.exports = User = mongoose.model("user", UserSchema);
