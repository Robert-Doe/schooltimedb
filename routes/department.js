const express = require('express')
const router = express.Router()
const Department = require('../model/department')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')


router.use(fileUpload());


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


/*router.post('/',(req,res)=>{
    if(req.body) {
        const {details, department_info, depart_abbr, lecturers} = {... JSON.parse(req.body)}
    }
    const newDepartment=new Department({
        details,department_info,dept_abbr,lecturers
    })
    newDepartment.save((err,success)=>{
        if(err)
            return res.status(400).json({msg:"Cannot insert"});
        res.json(success)
    })
    //res.send('Add new Department from BODY')
})*/


/*Retrieving all Departments*/
router.get('/', function (req, res) {

    Department.find({}, (err, data) => {
        if (err) return res.status(400).json({msg: "No Data"})
        res.status(200).json(data)
    })

})

/*Retrieving a Department By Id*/
router.get('/:id', (req, res) => {
    Department.findOne({"_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.status(200).json(data)
    })
})

/*Retrieving a Department By Id*/
router.delete('/:id', (req, res) => {
    Department.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})


router.delete('/', (req, res) => {
    Department.deleteMany({}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})

/*Updating a Department By Id*/
router.put('/:id', (req, res) => {
    Department.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
})


/*Adding a New Departments Using Files Upload*/
router.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../uploads/departments/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        fs.readFile(uploadPath, "utf8", (err, data) => {
            if (err) return res.status(500).send(err);
            let dataFile = csv2json(data, {parseNumbers: true})
            let validFiles = dataFile.filter(sample => (sample.name && sample._id && sample.dept_abbr))
            if(validFiles.length!==dataFile.length){
                return res.status(400).json({msg:'File Rejected : Data in .csv file Incorrect/Incomplete',status:'rejected'});
            }
            Department.insertMany(validFiles)
                .then(result => {
                    res.status(200).json({msg: 'Insert Successful', success: result,status:'success'});
                })
                .catch(error => {
                    return res.status(400).json({msg: 'Could Not Insert Files',error:error});
                });
        })
    });
});




/*Adding a New Department*/
router.post('/', function (req, res) {

    const {name, dept_abbr} = req.body;
    const newDepartment = new Department({
        "name": req.body.name,
        "_id":req.body._id,
        "dept_abbr": req.body.dept_abbr,
    });


    Department.find({})
        .exec({}, (error, data) => {
            if (error) return res.status(400).send(error);
            if (data.some((datum) => (datum.name === name) || data.dept_abbr === dept_abbr)) {
                return res.status(400).send({msg: "Cannot Duplicate"})
            } else {
                newDepartment.save((err) => {
                    if (err) return res.status(400).send(err)
                    res.status(200).json({"msg": "Save Successfully"})
                })
            }
        });


})


module.exports = router;