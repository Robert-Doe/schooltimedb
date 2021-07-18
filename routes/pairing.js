const express = require('express');
const router = express.Router();
const Pairing = require('../model/pairing');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

/*Retrieving all Pairings*/
router.get('/', function (req, res) {
    Pairing.find({}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
});

/*Retrieving a Pairing By Id*/
router.get('/:id', (req, res) => {
    Pairing.findOne({"_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
    // res.send(`Display pairing with respect to its ${req.params.id}`)
});

router.get('/courses/:id', (req, res) => {
    Pairing.find({"course_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
    // res.send(`Display pairing with respect to its ${req.params.id}`)
});

router.get('/lecturers/:id', (req, res) => {
    Pairing.find({"_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
    // res.send(`Display pairing with respect to its ${req.params.id}`)
});

/*Retrieving a Pairing By Id*/
router.delete('/:id', (req, res) => {
    Pairing.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
});

/*Updating a Pairing By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update pairing with respect to its ${req.params.id}`)
});


/*Adding a New Pairing*/
router.post('/', function (req, res) {
    const newPairing = new Pairing({"lecturer_id": req.body.lecturer_id, "course_id": req.body.course_id});
    newPairing.save(function (err) {
        if (err)
            return res.status(400).send(err);
        res.json({msg: "Saved Successfully"})
        console.log("Save Successfully");
    });
});

module.exports = router;