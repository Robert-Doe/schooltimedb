const express = require('express');
const router = express.Router();
const Batch = require('../model/batch');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());
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


router.put('/periods', (req, res) => {
    const {year, pair_string} = req.body;

        Batch.update({ _id: year }, { $push: { ['pairings']: pair_string } }).then(data=>{
            console.log(year, pair_string);
            res.status(200).json({msg: "Done Inserting"})
        }).catch(error=>{
            res.status(400).json({msg: "Error Inserting" , failure:error})
        })


})

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


/*Adding a New Batch Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/batches/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.size))

            Batch.insertMany(validFiles).then(result => {
                res.status(200).json({msg: 'Insert Successful', success: result});
            })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files',failure:error});
                })
        })
    });
});


/*Adding a New Batch*/
router.post('/', function (req, res) {

    const {name, year, dept_id, size, class_size, _id} = req.body;

    const newBatch = new Batch({
        "_id": _id,
        "year": year,
        "dept_id": dept_id,
        "size": size,
        "name": name,
        "class_size": class_size,
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