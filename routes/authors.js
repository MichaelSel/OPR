const express = require('express')
const router = express.Router()
const Author = require('../models/author')


//create author route
router.post('/', async(req,res)=>{
    const author= new Author({
        firstName: req.body.FN,
        lastName: req.body.LN,
        affiliation: req.body.affiliation
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch (err){
        console.error(err)
        res.render('authors/new', {
            author:author,
            errorMessage: 'Error Creating Author'
        })
    }
})


module.exports = router