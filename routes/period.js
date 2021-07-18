const express = require('express');
const router = express.Router();
const axios = require('axios');
const Period = require('../model/period');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Periods Route - Time: ', Date.now());
    next()
});

const readData = () => {
    let allPeriods = []
    Period.find({}, (error, response) => {
        if (error) return err
        else allPeriods = response;
    })

    return allPeriods
}

/*Retrieving all Periods*/
router.get('/', function (req, res) {
    Period.find({})
        .limit(11)
        .sort({_id: 1})
        .exec((err, data) => {
            if (err) {
                res.status(400).json({err: "Could not find Documents"});
                console.log("Errors soo")
            }
            res.json(data)
            //res.json(readData())
            console.log(readData())
        })
    // res.send('Display All Courses')
});


router.delete('/', (req, res) => {

    Period.deleteMany({}, function (err) {
        if (err) return res.status(400).send(err)
        Period.find({}, (err, data) => {
            if (err) res.status(400).send(err)
            res.json(data)
        })
    });

})

router.delete('/:id', (req, res) => {
    Period.deleteMany({}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data)
    });
})

/*Retrieving a Course By Id*/
router.get('/:id', (req, res) => {
    Period.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
});


/*Updating a Period By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update period with respect to its ${req.params.id}`)
});


// router.get('/packing',async (req,res)=>{
//     let resp = await axios.get('https://api.waziup.io/api/v2/devices/EspPARKING/sensors/SPD');
//     console.log(JSON.stringify(resp.data));
//     res.send(JSON.stringify(resp.data))
// })


/*Adding a New Period*/
router.post('/', function (req, res) {

    const newPeriod = new Period({
        "_id": req.body._id,
        "start": req.body.start,
        "end": req.body.end
    });

    Period.find({})
        .sort({_id: 1})
        .limit(12)
        .exec({}, (error, data) => {
            if (error) return res.status(400).send(error);
            if (data.some((datum) => datum._id === req.body._id)) {
                return res.status(400).send({msg: "Cannot Insert Period"})
            } else {
                newPeriod.save((err) => {
                    if (err) return res.status(400).send(err)
                    Period.find({})
                        .sort({_id: 1})
                        .exec((failure, periods) => {
                            res.json(periods);
                        })
                })
            }
        })

    // let data=readData();
    // console.log(data)
    // if(!data.some((period)=>period._id===req.body._id)){
    //     newPeriod.save((err,response)=>{
    //         if(err) return res.status(400).send(err)
    //         res.json(readData());
    //         console.log(readData())
    //     })
    // }else {
    //     res.status(400).send('Error Adding Data');
    // }


    /* Period.find({})
         .then(data=>{
             if(data.some((object)=>object._id=== req.body._id)){
                 newPeriod.save()
                     .then((data)=>res.json(readData()))
                     .catch(()=> res.status(400).json({
                     msg:"Error saving file"
                 }))
             }
         })
         .catch(err=>{
             console.log(err)
         })*/

    // Period.find({"_id": req.body._id}, (err, data) => {
    //     if (err) res.status(400).send(err)
    //
    //     if (data.length === 0) {
    //         newPeriod.save(function (err,response) {
    //             if (err)
    //                 return res.status(400).send(err);
    //             res.json(readData())
    //             console.log("Saved Successfully");
    //             console.log(response)
    //         });
    //     } else {
    //         res.json({msg: `Already Existing Period With Id: ${req.body._id}`})
    //     }
    // })
    //res.send('Add New Course')
});

module.exports = router;