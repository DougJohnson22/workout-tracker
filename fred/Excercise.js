const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExcerciseSchema = new Schema({
    name: String,
    length: Number,
    isCardio: Boolean,
    isStrength: Boolean,    
});


const Excercise = mongoose.model("Excercise", ExcerciseSchema);

module.exports = Excercise;