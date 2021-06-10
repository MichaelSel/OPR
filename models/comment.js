const mongoose = require('mongoose')
var ObjectId = require('mongoose').Types.ObjectId;
const Paper = require("../models/paper")
const commentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, required:true, ref:'Author'}, //User who wrote the comment
    content: {type: String, required:true}, //the content of the comment
    postedDate: {type:Date,required:true, default: Date.now()}, //Date created
    lastEdited: {type:Date,required:true, default: Date.now()}, //Date edited (equals date created unless edited)
    tags: [{type: String, default:[]}],
    children: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}], //ids of replies to this comment
    parent: {type: mongoose.Schema.Types.ObjectId, ref:'Comment', default:null}, //If this is a reply, this stores the id of the parent comment to which this is replying.
    paper: {type: mongoose.Schema.Types.ObjectId, ref:'Paper'} //The paper this comment is made about (only needed for threads, not for replies)
})



const putReplyReferenceInParent = async (reply,next) => {
    if(ObjectId.isValid(reply.parent)) { //If it has a parent, it's a reply. Update parent with a reference
        await Comment.updateOne({ _id: reply.parent }, { $push: { children: reply._id } }).exec()
        next()
    }
}
const incrementThreadCountOnPaper = async (thread,next) => {
    if(ObjectId.isValid(thread.paper)) { //If it has a parent, it's a thread. Increment the paper thread count
        await Paper.updateOne({ _id: thread.paper }, {$inc: { thread_count: 1} }).exec()
        next()
    }
}

commentSchema.pre('save', async function (next) {
    putReplyReferenceInParent(this,next) //for replies
    incrementThreadCountOnPaper(this,next) //for posts

})




const Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment