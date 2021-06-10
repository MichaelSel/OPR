//Stores the connection string to our db

process.env.DATABASE_URL = "mongodb://127.0.0.1:27017/OPR"


// module.exports = {
//     // url: "mongodb://52.20.37.140/test",
//     url : "mongodb://127.0.0.1:27017/OPR",
//     port: 27017,
//     user: 'admin',
//     pwd: 'aBasjdhwur67384662Asbcjjsgd2'
//
//     //url : "mongodb://localhost"
// }

//db.createUser({user: "admin", pwd: "aBasjdhwur67384662Asbcjjsgd2", roles: [ { role: "readWrite", db: "test" } ],mechanisms:["SCRAM-SHA-1"]})

//db.auth("admin", "aBasjdhwur67384662Asbcjjsgd2")