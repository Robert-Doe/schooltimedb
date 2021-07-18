const express = require('express')
const router = express.Router()
const Department = require('../model/department')

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
        if (err)
            return res.status(400).json({msg: "No Data"})
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

/*Updating a Department By Id*/
router.put('/:id', (req, res) => {
    Department.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
})


/*Adding a New Department*/
router.post('/', function (req, res) {

    const {name, dept_abbr} = req.body;
    const newDepartment = new Department({
        "name": req.body.name,
        /* "details":req.body.details,*/
        /*    "course_info":req.body.course_info,*/
        "dept_abbr": req.body.dept_abbr,
        /*"lecturers":req.body.lecturers*/
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