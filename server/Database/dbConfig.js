const mongoose = require('mongoose')

const uri = process.env.mongoDbUri
const dbname = process.env.DbName

const con = async ()=>{
    const dbcon = await mongoose.connect(`${uri}/${dbname}`)
    if(dbcon){
        return  "Db is connected "
        // console.log("Db is connected ")
    }else{
        return "Db is failed to connect"
        // console.log("Db is failed to connect")
    }
}

module.exports = con;