const express = require('express');
const router = express.Router();
const axios = require('axios');
const Course = require('../model/course');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

/*Retrieving all Courses*/
router.get('/', function (req, res) {
    Course.find({}, (err, data) => {
        if (err) {
            res.status(400).json({err: "Could not find Documents"});
            console.log("Errors soo")
        }
        res.json(data)
    })
    // res.send('Display All Courses')
});

/*Retrieving a Course By Id*/
router.get('/:id', (req, res) => {
    Course.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
});


/*Retrieving a Course By DepartmentId*/
router.get('/departments/:id', (req, res) => {
    Course.find({"dept_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
});


router.delete('/:id', (req, res) => {
    Course.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
});

/*Updating a Course By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update course with respect to its ${req.params.id}`)
});

router.get('/packing', async (req, res) => {
    let resp = await axios.get('https://api.waziup.io/api/v2/devices/EspPARKING/sensors/SPD');
    console.log(JSON.stringify(resp.data));
    res.send(JSON.stringify(resp.data))
})


/*Adding a New Course*/
router.post('/', function (req, res) {

    const newCourse = new Course({
        "key": req.body.key,
        "name": req.body.course_id,
        "course_abbr": req.body.course_abbr,
        "dept_id": req.body.dept_id,
        "credit": req.body.credit,
        "details": req.body.details
    });
    newCourse.save(function (err) {
        if (err)
            return res.status(400).send(err);
        res.json({msg: "Saved Successfully"});
        console.log("Saved Successfully");
    });
    //res.send('Add New Course')
});

module.exports = router;