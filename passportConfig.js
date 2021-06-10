const Author = require('./models/author')
const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy


module.exports = function (passport) {
    passport.use(new localStrategy({usernameField:'email'},(username,password,done)=>{
        Author.findOne({email:username}, (err,user)=>{ //See if user with such an email exists
            if(err) done(err)
            //If not
            if(!user) return done(null,false); //CB with err=null and user = false
            //If yes, we'll validate the password

            user.comparePassword(password, function(err, valid) {
                if (err) throw err;
                console.log(valid)
                if(valid===true) return done(null,user) //CB with err=null and user = user
                else return done(null,false) //CB with err=null and user = false
            });
        })
    }))
    passport.serializeUser((user,cb)=>{
        cb(null,user._id)
    })

    passport.deserializeUser((id,cb)=> {
        Author.findOne({_id:id}, (err,user) =>{
            user.password=null //remove the password from the object
            cb(err,user)
        })
    })
}