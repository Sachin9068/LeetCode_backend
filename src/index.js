const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const  authRouter = require('./routes/userAuth');
const redisclient = require('./config/redis');
const problemRouter = require('./routes/problemcreator');


app.use(express.json()); 
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);


const initilizeConnetion = async ()=>{
    try{
        await Promise.all([main(),redisclient.connect()]);
        console.log("Db Connected");

         app.listen(process.env.PORT,()=>{
        console.log("Sever Listening at Port Number : "+process.env.PORT)});
    }
    catch(err){
        console.log("Connection Error : "+err);
    }
}

 initilizeConnetion();

