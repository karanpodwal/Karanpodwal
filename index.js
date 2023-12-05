
const express = require("express");
const app = express();


require("dotenv").config();

const PORT = process.env.PORT||7000;

app.use(express.json());


app.use("api/v1",require("./routes/route"));


//start server 

app.listen(PORT,()=>{
    console.log(`server started on PORT ${PORT}`);
})


const dbconnect = require("./config/database");

db.connect();
