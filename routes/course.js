const express = require('express');
const router = express.Router();
const Course = require('../model/course');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());

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



/*Adding a New Course Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/courses/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.name))
            Course.insertMany(validFiles)
                .then(result => {
                    res.status(200).json({msg: 'Insert Successful', success: result});
                })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files'});
                });
        })
    });
});


/*Adding a New Course*/
router.post('/', function (req, res) {

    const newCourse = new Course({
        "name": req.body.name,
        "_id": req.body._id,
        "dept_id": req.body.dept_id,
        "credit": req.body.credit,
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