// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
const mongoose = require('mongoose');
var compression = require("compression");
const logger = require("morgan");
// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================
var app = express();
var PORT = process.env.PORT || 8080;

app.use(compression());
app.use(logger("dev"));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

const db = require('./models');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutplanner", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// ================================================================================
// ROUTER
// ================================================================================
app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html')
})

// SEED DATA
const seedExcercises = [
    {
        name: 'Run',
        length: 30,
        isCardio: true,
        isStrength: false,
    },
    {
        name: 'Lift Weights',
        length: 60,
        isCardio: false,
        isStrength: true,
    },
    {
        name: 'Sit Ups',
        length: 15,
        isCardio: false,
        isStrength: true,
    },
    {
        name: 'Squats',
        length: 20,
        isCardio: false,
        isStrength: true,
    },
    {
        name: 'Row',
        length: 45,
        isCardio: true,
        isStrength: false,
    },

]
app.get('/seedplans', (req, res) => {
    db.Excercise.create(seedExcercises)
        .then(result => {
            console.log(result)
            db.WorkoutPlan.create([
                {
                    name: 'plan 1',
                    excercise: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'plan 2',
                    excercise: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'plan 3',
                    excercise: [
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'plan 4',
                    excercise: [
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'plan 5',
                    excercise: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },

            ])
                .then(fullRes => {
                    // console.log(fullRes)
                    res.json(fullRes)
                })
                .catch(err => {
                    res.json(err)
                })
        })
        .catch(err => {
            // console.log(err)
            res.json(err)
        })
})


// VIEW DATA
app.get('/api/excercises', (req, res) => {
    db.Excercise.find({})
        .then(dbExcercise => {
            res.json(dbExcercise);
        })
})
// get all plans
app.get('/api/plans', (req, res) => {
    db.WorkoutPlan.find({})
        .then(dbPlan => {
            res.json(dbPlan)
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        })
})

// Read populated workout plans
app.get('/populatedplans', (req, res) => {
    db.WorkoutPlan.find({})
        .populate('excercise')
        .then(dbPlan => {
            res.json(dbPlan)
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        })
})
// Create Plan
app.post('/api/plans', ({ body }, res) => {
    db.WorkoutPlan.create(body)
        .then(dbPlan => {
            res.json(dbPlan)
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        })
})
// Create Exercise
app.post('/api/excercises', (req, res) => {
    console.log(req.body);

    // Update Excercise
    db.Excercise.create(req.body)
        .then(dbExcercise => {
            db.WorkoutPlan.findOneAndUpdate({ _id: req.body.planid }, { $push: { excercises: dbExcercise._id } })
                .then(dbPlan => res.send(dbPlan))
        })
        .catch(err => res.json(err))

})
// =============================================================================
// LISTENER
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});