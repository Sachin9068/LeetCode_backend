const redisclient = require('../config/redis');
const User = require('../Models/user');
const validate = require('../utils/validator');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req,res)=>{
  
    try{
        //validate the data
        // console.log(req.body);
        validate(req.body);
        const {firstName,emailId,password} = req.body;

        req.body.password = await bycrpt.hash(password,10);
        req.body.role = 'user'

         const user = await User.create(req.body);
         const token = jwt.sign({_id:user._id,role:"user",emailId},process.env.JWT_KEY,{expiresIn:60*60});
         res.cookie('token',token,{maxAge:60*60*1000});
         res.status(201).send("User Registered Successfully");
    }
    catch(err){
       res.status(400).send("Error  : "+err);
    }
}

const login = async (req,res)=>{
    try{
          const {emailId,password} = req.body;

          if(!emailId)
            throw new Error("Invalid Credential");
          if(!password)
            throw new Error("Invalid Cradentials");

          const user = await User.findOne({emailId});
          const match = bycrpt.compare(password,user.password);

          if(!match)
            throw new Error("Invalid Credentials");
        
        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});

         res.status(200).send("Succesfully Login");
    }
    catch(err){
    res.status(401).send("Error : "+err);
    }
}

const logout =  async(req,res)=>{
    try{
    

        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisclient.set(`token:${token}`,'Blocked');
        await redisclient.expireAt(`token:${token}`,payload.exp);

        // then token add in redis (blocklist);
        // cookies ko clear kr dena...

        res.cookie('token',null,{expires : new Date(Date.now())});
        res.send("Logout Succesfully done");                

    }

    catch(err){
        res.status(503).send("ERRor : "+err);
    }
}

const adminRegister = async (req,res)=>{
       try{
        
        // if(req.result.role!="admin");
        //    throw new Error("invalid Crendeitial");

        validate(req.body);
        const {firstName,emailId,password} = req.body;

        req.body.password = await bycrpt.hash(password,10);
        // req.body.role = 'admin'

         const user = await User.create(req.body);
         const token = jwt.sign({_id:user._id,role:user.role,emailId},process.env.JWT_KEY,{expiresIn:60*60});
         res.cookie('token',token,{maxAge:60*60*1000});
         res.status(201).send("User Registered Successfully");
    }
    catch(err){
       res.status(400).send("Error  : "+err);
    }
}

module.exports ={register,login,logout,adminRegister}; 