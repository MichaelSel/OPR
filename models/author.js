const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10




const authorSchema = new mongoose.Schema({
    firstName: {type: String, required:true},//First name of user/author
    lastName: {type: String, required:true}, //Last name of user/author
    email: {type: String},
    password: {type:String},
    affiliation: {type: String}, //user's affiliation (NYU, Columbia, etc.)
    profileImagePath: {type: String}, //Path to the user's avatar
    claimed: {type: Boolean, required:true, default:false}, //real user (claimed), or auto-generated (unclaimed)
})


authorSchema.pre('save', function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err,salt) => {
        if(err) return next(err)

        //hash the password along with our new salt
        bcrypt.hash(this.password,salt, (err,hash) => {
            if(err) return next(err)

            //override the cleartext password with the hased one
            this.set('password',hash);
            next()
        })
    })
})



authorSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}


module.exports = mongoose.model('Author',authorSchema)