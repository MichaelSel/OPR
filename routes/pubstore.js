const router = require('express').Router()
const AWS = require('aws-sdk'); //Amazon Web Services
AWS.config.update({region: 'us-east-2'}); //set zone for AWS
AWS.config.loadFromPath('aws_auth.json'); //Load credentials
const s3 = new AWS.S3() //S3 connection object.
const bucket = require('../aws').bucket //the S3 bucket used


router.get('/:key',(req,res)=>{

    const key = req.params.key
    console.log(key)
    const params = {
        Bucket: bucket,
        Key:key
    }
    s3.getObject(params, function (err, data) {
        if (err) {
            console.error(err)
        } else {
            res.send(data.Body)
        }
    });
})

module.exports = router

