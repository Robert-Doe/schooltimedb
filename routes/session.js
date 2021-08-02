const express = require('express')
const router = express.Router()
const Session = require('../model/session');

let days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'];
let schedules = [];

const rangeArray = (start, end) => {
    return [...Array(end).keys()].filter(x => x >= start);
}

const intValue = (numString) => Number.parseInt(numString);

const pObject = (period = 'Mon-00-00') => {
    return {
        day: period.split('-')[0],
        start: intValue(period.split('-')[1]),
        end: intValue(period.split('-')[2])
    }
}

const rangeWithPeriod = (period) => {
    const {start, end} = pObject(period);
    return rangeArray(start, end);
}

const doIntersect = (fPeriod, sPeriod) => {
    if (pObject(fPeriod).day === pObject(sPeriod).day) {
        return rangeWithPeriod(fPeriod).filter(x => rangeWithPeriod(sPeriod).includes(x)).length > 0
    } else {
        return false
    }
}


const getLecturer = (pairId) =>{
   // console.log('Lecturer', pairId.split('-')[0])
    return pairId.split('-')[0];
}


const getRandomClassroom = (period, batchSize,classrooms) => {
    let randomRoom = null;
    let fitClasses = classrooms.filter(classroom => classroom.size >= batchSize);
    do {
        randomRoom = fitClasses[Math.floor(Math.random() * fitClasses.length)];
        if (randomRoom === undefined) {
            randomRoom = {id: 'UNDEFINED', size: null}
        }
    } while ((schedules.some(session => session.period === period && session.classroom === randomRoom.id)));

    if (randomRoom.size >= batchSize) {
        return randomRoom.id
    } else {
        return 'UNDEFINED'
    }
}

const getRandomTime =  (hours, lecturerId, batchId, schedules) => {
    let sampletime = 'Mon-00-00';
    const sFreePeriods = studentFreeTime(batchId, hours, schedules);
    const lFreePeriods = lecturerFreeTime(lecturerId, hours, schedules);

    const bestTimes = sFreePeriods.filter(x => lFreePeriods.includes(x));

    if (bestTimes !== []) {
        sampletime = bestTimes[Math.floor(Math.random() * bestTimes.length)]
    }

    return sampletime;
}

const studentFreeTime =  (batchId, time, schedules) => {
    const currentSchedule =schedules.map(session => {
        if (session.batch_id === batchId) {
            return session.period;
        }
    });
    return possibleSet(time, 11).filter(x => !currentSchedule.some(y => doIntersect(x, y)));
}


const lecturerFreeTime =  (lecturerId, time, schedules) => {
    const currentSchedule = schedules.map(session => {
        if (getLecturer(session.pair_id) === lecturerId) {
            return session.period;
        }
    });
    return possibleSet(time, 11).filter(x => !currentSchedule.some(y => doIntersect(x, y)));//Change the 12 to 11
}

const possibleSet = (duration, maxPeriod) => {
    let freePeriod = [];
    days.forEach(day => {
        let count = 1;
        while (count <= (maxPeriod - (duration - 1))) {
            freePeriod.push(`${day}-${count}-${count + duration}`);
            count++;
        }
    });
    return freePeriod;
}


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


/*Retrieving all Sessions*/
router.get('/', function (req, res) {
    Session.find({}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
})

/*Retrieving all Sessions*/
router.get('/batch/id', function (req, res) {
    Session.find({"batch_id": req.params.id}, (err, data) => {
        if (err)
            return res.status(400).json({msg: "No Data"})
        res.json(data)
    })
})

/*Retrieving a Session By Id*/
router.get('/:id', (req, res) => {
    Session.findById({"_id": req.params.id}, function (err, data) {
        if (err) res.status(400).send(err)
        res.json(data);
    });
    //res.send(`Display session with respect to its ${req.params.id}`)
})

/*Retrieving a Session By Id*/
router.delete('/:id', (req, res) => {
    Session.deleteOne({_id: req.params.id}, function (err) {
        if (err) res.status(400).send(err)
        res.json({msg: "Successful deletion"});
    });
})

/*Updating a Session By Id*/
router.put('/:id', (req, res) => {
    res.send(`Update session with respect to its ${req.params.id}`)
})


/*Adding a New Session*/
router.post('/', function (req, res) {
    const newSession = new Session({
        "pair_id": req.body.pair_id,
        "batch_id": req.body.batch_id,
        "hall_id": req.body.hall_id,
        "period": req.body.period,
    });

   /* {
        period:`${value(dayRef)}-${start}-${start+end}` ,
            pair_id: getCurrentId(courseRef),
        batch_id: getCurrentId(batchRef),
        classroom: value(hallRef)
    }*/

    newSession.save(function (err) {
        if (err)
            return res.status(400).send(err);
        res.json({msg: "Saved Successfully"})
        console.log("Save Successfully");
    });
})

router.post('/algorithm',(req,res)=>{

    const {batches,sessions,classrooms}=req.body;
    schedules=sessions?sessions:[];
   console.clear();
    batches.forEach((batch) => {
        batch.pairings.forEach( (pair) => {
            let lecturer = getLecturer(pair)
            let period = getRandomTime(2, lecturer, batch.id, schedules)
            let classroom = getRandomClassroom(period, batch.size,classrooms);
            //console.log(batch.id,period,lecturer,classroom);
            const newSession = {
                period: period,
                pair_id: pair,
                batch_id: batch.id,
                classroom: classroom
            };
            if(newSession.period && period!=="Mon-00-00"){
                schedules.push(newSession);
            }
        })
    })
    let result_schedules=schedules;
    schedules=[];
    res.json({schedules:result_schedules})
})


module.exports = router