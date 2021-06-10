/** Imports*/

    const express = require("express")
    const app = express()
    const cors = require("cors")
    const bodyParser = require('body-parser')
    const passport = require('passport') //Authenticator
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const MongoStore = require('connect-mongo')
    const mongoose = require('mongoose') //create a mongoose connection
    require('./database_connection') //Loads DB creds into ENV variables

/**--------------------------------------END OF IMPORT----------------------------------*/


/** Middleware*/

    process.env.session_secret = "S:nx(P2&S,:B@\"-T?=NLbCt*szSKY\"~Wx&3'nVq^~BVde" //TODO: Don't hard code this here

    app.use(cors({
        origin: "http://localhost:3000", //<--- location of react app
        credentials:true,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }))

    app.use(function(req, res, next) {
        res.header('Content-Type', 'application/json;charset=UTF-8')
        res.header('Access-Control-Allow-Credentials', true)
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
        next()
    })

    app.use(cookieParser(process.env.session_secret))



    app.use(session({
        secret:process.env.session_secret,
        resave:true,
        saveUninitialized:true,
        cookie: {
            maxAge: 1000* 60 * 60 *24 * 14
        },
        store: MongoStore.create({mongoUrl:process.env.DATABASE_URL})
    }))

    //Initialize passport and passport session
    app.use(passport.initialize());
    app.use(passport.session())
    //pass this instance of passport to our passportConfig file
    require('./passportConfig')(passport)

    passport.authenticate('jwt', { session: false }); //Trying to authenticate with a JWT cookie

    // body-parser exposes req.body
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded ({limit: '10mb', extended:false}))

    // DB connection

    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology:true}) //connect to DB

//test








/**--------------------------------------END OF MIDDLEWARE----------------------------------*/

/** Routing*/

    var router = express.Router();

    //Use for every address starting with /
    const indexRouter = require('./routes/index')(passport)
    app.use('/', indexRouter)

    //Use for every address starting with /authors
    const authorRouter = require('./routes/authors')
    app.use('/authors', authorRouter)

    //Use for every address starting with /papers
    const paperRouter = require('./routes/papers')
    app.use('/papers', paperRouter)

    //Use for every address starting with /read
    const discussionRouter = require('./routes/discussion')
    app.use('/discussion', discussionRouter)

    //Use for every address starting with /read
    const searchRouter = require('./routes/search')
    app.use('/search', searchRouter)

    //Use for every address starting with /pubstore
    const pubstoreRouter = require('./routes/pubstore')
    app.use('/pubstore', pubstoreRouter)

    //Set a public static folder
    app.use('/public',express.static('public'))

/**--------------------------------------END OF ROUTING----------------------------------*/



/** DB Events*/
    const db = mongoose.connection
    db.on('error', error => console.error(error))
    db.once('open', () => console.log("Connected to DB"))

/**--------------------------------------END OF DB EVENTS----------------------------------*/



/** Start Server*/
    app.listen(process.env.PORT || 3001)


