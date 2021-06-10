const mongoose = require('mongoose');
const router = require('express').Router()
const Paper = require('../models/paper') //DB access to papers
const multer = require('multer') //used for multipart uploads
var multerS3 = require('multer-s3') //used for multipart uploads to S3

const AWS = require('aws-sdk'); //Amazon Web Services
AWS.config.update({region: 'us-east-2'}); //set zone for AWS
AWS.config.loadFromPath('aws_auth.json'); //Load credentials
const s3 = new AWS.S3() //S3 connection object.
const bucket = require('../aws').bucket //the S3 bucket used

/** /papers */


/**Handles uploading of papers to S3*/
const paper_upload = multer({
    fileFilter: (req,file,cb) => {
        cb(null,file.mimetype=="application/pdf") //Only accept pdf files
    },
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: bucket,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString()+".pdf")
        }
    })
})





router.get('/', async (req,res)=> {
    try {
        const papers = await Paper.find({}).populate('uploader').populate('authors')
        res.send(JSON.stringify(papers))
    } catch (err) {
        console.error(err)
    }

})

router.get('/get/:id', async (req,res)=> {
    const id = req.params.id
    try {
        const paper = await Paper.findOne({_id:id}).populate('uploader').populate('authors')
        res.send(JSON.stringify(paper))
    } catch (err) {
        console.error(err)
    }

})


/** ONLY ACCESSIBLE FOR LOGGED IN USERS*/

router.use( (req, res, next) => req.isAuthenticated() ? next() : res.status(403).send("must log in") )


//create paper route
router.post('/', paper_upload.single('pdf'),async(req,res)=>{
    const key = req.file !=null ? req.file.key : null
    let authors = req.body.authors
     authors = Array.isArray(req.body.authors)?authors:[authors]
    const paper = new Paper({
        title:req.body.title, //Get title from form
        abstract: req.body.abstract, //Get abstract from form
        uploadMessage: req.body.uploadMessage,
        publishedDate: new Date(req.body.publishedDate),

        uploader:mongoose.Types.ObjectId(req.body.uploader),
        // uploader:req.body.author,
        authors: authors.map(a=>mongoose.Types.ObjectId(a)),
        // authors: [req.body.author],
        pdf_path: key //The name of the file on the server
        //TODO: allow for tags, and journal fields
    })

    try {
        const newPaper = await paper.save()
        // res.redirect(`papers/${newAuthor.id}`)
        console.log("success")
        res.redirect(`papers`)
    } catch (err){
        s3.deleteObject({Bucket:bucket,Key:key}, function (err, data) {
            if (err) console.log(err);
            else console.log("Successfully deleted file from bucket");
        });
        console.error(err)
    }
})




module.exports = router



