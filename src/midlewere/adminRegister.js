const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const redisclient = require('../config/redis');

const adminMiddleware = async (req,res,next)=>{
    try{

        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not present");

       const payload = jwt.verify(token,process.env.JWT_KEY);

       const {_id} = payload;
       if(!_id)
         throw new Error("Invalid Token.");

      const result = await User.findById(_id);
      
      if(payload.role!='admin')
           throw new Error("Invalid Tokan");

      if(!result)
        throw new Error("User Does't EXist");

      //radis ke blocklist me present toh nhi h

      const IsBlocked = await redisclient.exists(`token:${token}`);

      if(IsBlocked)
          throw new Error("Invalid Token");

      req.result = result;

      next();


    }
    catch(err){
       res.status(401).send("Error : "+err);
    }
}

module.exports = adminMiddleware;