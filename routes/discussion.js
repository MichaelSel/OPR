const router = require('express').Router()
const Comments = require('../models/comment') //DB access to comments (threads/replies)
const ObjectId = require('mongoose').Types.ObjectId;

/** /discussion */

const getThreads = async function (paperId) {
    try {
        const threads = await Comments.find({paper:ObjectId(paperId)})
            .populate('author')
            .populate({
                path : 'children',
                populate : {
                    path : 'author',
                }
            })
            .exec()
        return threads
    } catch (e) {
        console.error(e)
    }
}


const postThread = async function(params) {
   return await processPostParams(params,async (err,post) => {
        if(err) throw err
        try {
            let thread = new Comments()
            thread.author = post.author
            thread.content = post.content
            thread.paper = post.paper
            thread.tags = post.tags

            const doc = await thread.save().then(t => t
                .populate('author')
                .populate('children')
                .populate('children.author')
                .execPopulate())
            return doc
        } catch (e) {
            console.error(e)
        }
    })
}
const postReply = async function (params) {
    return await processPostParams(params,async (err,post)=>{
        if(err) throw err
        try {
            let reply = new Comments()
            reply.author = post.author
            reply.content = post.content
            reply.parent = post.parent
            reply.tags = post.tags
            const doc = await reply.save()
            return doc
        } catch (e) {
            console.error(e)
        }
    })

}

const processPostParams = function (params,cb) {
    if(!ObjectId.isValid(params.author)) return cb("invalid author",null)
    if(!ObjectId.isValid(params.paper) && !ObjectId.isValid(params.parent)) return cb("invalid paper/thread",null)
    if(params.content=="" || typeof params.content!="string") return cb("invalid content",null)

    const author = ObjectId(params.author)

    const paper = ObjectId.isValid(params.paper)?ObjectId(params.paper): ""
    const parent =  ObjectId.isValid(params.parent)?ObjectId(params.parent): ""

    const content = params.content.trim()

    const hashtagRegex = /#[a-z]+/gi
    const tags = [...content.matchAll(hashtagRegex)].map(a=>a[0]).map(hashtag=>hashtag.slice(1))

    const post = {
        author: author,
        paper: paper,
        parent: parent,
        content: content,
        tags: tags
    }
    return cb(null,post)
}


router.get('/threads',  async (req,res)=> {
    const paperId = req.query.paper

    try {
        const threads = await getThreads(paperId)

        res.send(JSON.stringify(threads))
    } catch (e) {
        console.error(e)
        res.status(500).send("Request failed.")
    }
})


router.post('/thread',  async (req,res)=> {

    const params = {
        author: req.user._id,
        content: req.body.content,
        paper: req.body.paperId
    }

    try {
        const thread = await postThread(params)
        res.send(JSON.stringify(thread))
    } catch (e) {
        console.error(e)
        res.status(500).send("Failed to post thread.")
    }
})

router.post('/reply',  async (req,res)=> {

    const params = {
        author: req.user._id,
        content: req.body.content,
        parent: req.body.parent
    }
    try {
        const reply = await postReply(params)
        res.send(JSON.stringify(reply))
    } catch (e) {
        console.error(e)
        res.status(500).send("Failed to post reply.")
    }
})




module.exports = router
