const mongoose = require('mongoose')

const uri = process.env.mongoDbUri
const dbname = process.env.DbName

const con = async ()=>{
    const dbcon = await mongoose.connect(`${uri}/${dbname}`)
    if(dbcon){
        console.log("Db is connected ")
    }else{
        console.log("Db is failed to connect")
    }
}

module.exports = con;