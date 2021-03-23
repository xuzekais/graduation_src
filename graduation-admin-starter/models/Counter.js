const mongoose = require("mongoose")
const Counter = new mongoose.Schema({
  _id:{
    type: String,
    require: true
  },
  seq_val:{
    type: Number,
    default: 0
  }
})


module.exports = mongoose.model("Counter", Counter)