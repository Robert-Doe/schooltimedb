const express = require('express')
const router = express.Router()
const Lecturer = require('../model/lecturer')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

/*Retrieving all Lecturers*/
router.get('/', function (req, res) {
    Lecturer.find({}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data", err: err})
        res.json(data)
    })
})


/*Retrieving a Lecturer By Id*/
router.get('/departments/:id', (req, res) => {
    Lecturer.find({"dept_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
})


/*Retrieving a Lecturer By Id*/
router.get('/:id', (req, res) => {
    Lecturer.findOne({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
})

/*Retrieving a Lecturer By Id*/
router.delete('/:id', (req, res) => {
    Lecturer.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})

/*Updating a Lecturer By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update lecturer with respect to its ${req.params.id}`)
})


/*Adding a New Batch Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/lecturers/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.size))
            Lecturer.insertMany(validFiles)
                .then(result => {
                    res.status(200).json({msg: 'Insert Successful', success: result});
                })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files'});
                });
        })
    });
});


/*Adding a New Lecturer*/
router.post('/', function (req, res) {
    const {fname, lname, dept_id, courses, sessions, abbr} = req.body;
    const newLecturer = new Lecturer({
        "_id":req.body._id,
        "fname": req.body.fname,
        "dept_id": req.body.dept_id,
        "courses": req.body.courses,
        "sessions": req.body.sessions,
        "lname": req.body.lname,
        "abbr:": req.body.abbr
    });
    // newLecturer.save(function (err) {
    //     if (err)
    //         return res.status(400).send(err);
    //     res.json({msg:"Saved Successfully"})
    //     console.log("Save Successfully");
    // });


    Lecturer.find({})
        .exec({}, (error, data) => {
            if (error) return res.status(400).send(error);
            if (data.some((datum) => (datum.dept_id === dept_id && (datum.abbr === abbr)))) {
                return res.status(400).send({msg: "Cannot Duplicate"})
            } else {
                newLecturer.save((err) => {
                    if (err) return res.status(400).send(err)
                    res.status(200).json({"msg": "Save Successfully"})
                })
            }
        });


})


module.exports = router