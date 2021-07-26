const express = require('express')
const router = express.Router()
const Session = require('../model/session');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


/*Retrieving all Sessions*/
router.get('/', function (req, res) {
    Session.find({}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
})

/*Retrieving all Sessions*/
router.get('/batch/id', function (req, res) {
    Session.find({"batch_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
})

/*Retrieving a Session By Id*/
router.get('/:id', (req, res) => {
    Session.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
    //res.send(`Display session with respect to its ${req.params.id}`)
})

/*Retrieving a Session By Id*/
router.delete('/:id', (req, res) => {
    Session.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})

/*Updating a Session By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update session with respect to its ${req.params.id}`)
})


/*Adding a New Session*/
router.post('/', function (req, res) {
    const newSession = new Session({
        "pair_id": req.body.pair_id,
        "batch_id": req.body.batch_id,
        "hall_id": req.body.hall_id,
        "period": req.body.period
    });

    newSession.save(function (err) {
        if (err)
            return res.status(400).send(err);
        res.json({msg: "Saved Successfully"})
        console.log("Save Successfully");
    });
})

module.exports = router
