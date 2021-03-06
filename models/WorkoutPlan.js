const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutPlanSchema = new Schema({
    name: String,
    excercise: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Excercise'
        }
    ]

})


const WorkoutPlan = mongoose.model("WorkoutPlan", WorkoutPlanSchema);

module.exports = WorkoutPlan;