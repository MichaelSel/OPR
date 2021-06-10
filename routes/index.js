const express = require('express')
const router = express.Router()
const Author = require("../models/author")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');




module.exports = function (passport) {



    router.post("/login", (req,res,next)=>{

        passport.authenticate("local", (err,user,info)=> {
            if(err) throw err;
            if(!user) res.status(403).send("Email doesn't exist.")
            else {
                req.logIn(user,err=>{
                    if(err) throw err;
                    req.session.jwt = jwt.sign(user.toJSON(), process.env.session_secret);


                    user.password=null
                    res.send(user)
                })
            }
        })(req,res,next)

    })

    router.post("/register", async (req,res)=>{
        try {
            const author = await Author.findOne({email:req.body.email})
            if(author) res.status(403).send("User already exists")
            else {
                const newAuthor = new Author({
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password, //password is automatically hashed in pre-save hook in model
                    affiliation: req.body.affiliation,
                    claimed: true
                })
                try{
                    await newAuthor.save()
                    console.log("User with id", newAuthor._id,"saved.")
                    res.status(200).send("User created.")
                } catch (err) {
                    console.error(err)
                }

            }
        } catch (err) {
            console.error(err)
        }
    })

    router.get("/user", (req,res)=>{
        res.send(req.user)
    })

    router.get("/authenticated", (req,res)=>{
        let authenticated = req.user?true:false
        console.log(authenticated)
        res.send(authenticated)

    })

    router.get('/logout', function(req, res){
        req.logout();
        res.status(200).send("Logged out.")
    });

    return router
}


