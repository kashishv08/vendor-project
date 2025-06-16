const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "vendor", "user"],
    default: "vendor",
  },
});

userSchema.plugin(passportLocalMongoose); //add username ,hash,salt on their own
module.exports = mongoose.model("User", userSchema);
