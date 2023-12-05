
const express = require("express");

const  routes = express.Router();

//import controller


const{signup,login,forgetpossword,userfindID} = require("../controllers/logic");
s


//define api routes


routes.post("/signup",signup);
routes.get("/login",login);
routes.get("/forgetpossword",forgetpossword)
routes.get("/userfindID",userfindID)

