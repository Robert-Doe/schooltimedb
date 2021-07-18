const express = require('express');
const router = express.Router();
const Batch = require('../model/batch');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Batch Time Time: ', Date.now());
    next()
});

/*Retrieving all Batchs*/
router.get('/', function (req, res) {
    Batch.find({}, (err, data) => {
        if (err) {
            res.status(400).json({err: "Could not find Documents"});
            console.log("Errors soo")
        }
        res.json(data)
    })
    // res.send('Display All Batchs')
});

/*Retrieving a Batch By Id*/
router.get('/:id', (req, res) => {
    Batch.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
});


/*Retrieving a Batch By Dept Id*/
router.get('/departments/:id', (req, res) => {
    Batch.find({"dept_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
});


/*Retrieving a Batch By Id*/
router.delete('/:id', (req, res) => {
    Batch.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
});

/*Updating a Batch By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update course with respect to its ${req.params.id}`)
});


/*Adding a New Batch*/
router.post('/', function (req, res) {

    const {name, year, dept_id, size, class_size} = req.body;

    const newBatch = new Batch({
        "year": year,
        "dept_id": dept_id,
        "size": size,
        "name": name,
        "class_size": class_size
    });

    Batch.find({})
        .exec({}, (error, data) => {
            if (error) return res.status(400).send(error);
            if (data.some((datum) => datum.dept_id === dept_id && (/*(datum.year===year)||*/(datum.name === name)))) {
                return res.status(400).json({msg: "Cannot Insert Batch", status: "failure"})
            } else {
                newBatch.save((err) => {
                    if (err) return res.status(400).send(err)
                    res.status(200).json({"msg": `${name} Saved Successfully`, status: "success"})
                })
            }
        });


});

module.exports = router;