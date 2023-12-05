const mongose = require("mongoose");

require("dotenv").config();


const dbConnect = ()=>{
    mongose.connect(process.env.DATABASE_URL,{
        newNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("db k connection successfully"))
    .catch((error)=> {
        console.log("use in db connceiton");
        console.error(error.message);
        process.exit(1);
    })
}

module.exports = dbConnect;