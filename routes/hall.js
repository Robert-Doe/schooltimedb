const express = require('express')
const router = express.Router()
const Hall = require('../model/hall')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

/*Retrieving all Halls*/
router.get('/', function (req, res) {
    Hall.find({}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
})

/*Retrieving a Hall By Id*/
router.get('/:id', (req, res) => {
    Hall.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
})

/*Retrieving a Hall By Id*/
router.delete('/:id', (req, res) => {
    Hall.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})

/*Updating a Hall By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update hall with respect to its ${req.params.id}`)
})


/*Adding a New Hall*/
router.post('/', function (req, res) {
    res.send('Add New Hall')
})

module.exports = router