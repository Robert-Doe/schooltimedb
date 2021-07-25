const express = require('express')
const router = express.Router()
const Hall = require('../model/hall')

const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());

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


/*Adding a New Batch Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/classrooms/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.size))
            Hall.insertMany(validFiles)
                .then(result => {
                    res.status(200).json({msg: 'Insert Successful', success: result});
                })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files'});
                });
        })
    });
});






/*Adding a New Hall*/
router.post('/', function (req, res) {
    res.send('Add New Hall')
})

module.exports = router