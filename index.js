const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const departmentRouter = require('./routes/department');
const lecturerRouter = require('./routes/lecturer')
const pairingRouter = require('./routes/pairing');
const sessionRouter = require('./routes/session');
const hallRouter = require('./routes/hall');
const courseRouter = require('./routes/course')
const periodRouter = require('./routes/period')
const batchRouter = require('./routes/batch')
const path = require("path")
const fileUpload = require('express-fileupload');
const fs = require('fs')
const csv2json = require('csvjson-csv2json/csv2json')
dotenv.config()

const PORT=process.env.PORT || 80


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))

// default options
//app.use(fileUpload());

// app.post('/upload', function (req, res) {
//     let sampleFile;
//     let uploadPath;
//
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }
//
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     sampleFile = req.files.sampleFile;
//     uploadPath = __dirname + '/uploads/' + sampleFile.name;
//
//     // Use the mv() method to place the file somewhere on your server
//     sampleFile.mv(uploadPath, function (err) {
//         if (err) return res.status(500).send(err);
//         fs.readFile(uploadPath, "utf8", (err, data) => {
//             if (err)return res.status(500).send(err);
//             console.log(csv2json(data, {parseNumbers: true}));
//             res.send(data);
//             })
//        // res.send('File uploaded!');
//     });
// });


const mongoDB = process.env.ATLAS_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use('/departments', departmentRouter);
app.use('/lecturers', lecturerRouter);
app.use('/sessions', sessionRouter);
app.use('/pairings', pairingRouter);
app.use('/halls', hallRouter);
app.use('/batches', batchRouter);
app.use('/courses', courseRouter);
app.use('/periods', periodRouter);

// app.get('/',(req,res)=>{
//     res.json({msg:'HOME PAGE'});
// })



app.listen(9999, () => {
    console.log("I am listening to port 9999")
})