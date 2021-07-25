const express = require('express');
const router = express.Router();
const Pairing = require('../model/pairing');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());

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
    Pairing.find({"lecturer_id": req.params.id}, (err, data) => {
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


/*Adding a New Batch Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/pairings/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.size))
            Pairing.insertMany(validFiles)
                .then(result => {
                    res.status(200).json({msg: 'Insert Successful', success: result});
                })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files'});
                });
        })
    });
});


/*Adding a New Pairing*/
router.post('/', function (req, res) {
    const newPairing = new Pairing({
        "_id":`${req.body.lecturer_id}-${req.body.course_id}`,
        "lecturer_id": req.body.lecturer_id,
        "course_id": req.body.course_id});

    newPairing.save(function (err) {
        if (err)
            return res.status(400).json({msg:'err Could Not Insert'});
        res.json({msg: "Saved Successfully"})
        console.log("Save Successfully");
    });
});

module.exports = router;