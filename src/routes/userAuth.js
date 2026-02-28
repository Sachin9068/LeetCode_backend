const express = require('express');
const authRouter = express.Router();
const {register,login,logout,adminRegister} = require('../controllers/userAuthent')
const userMiddleware = require('../midlewere/usermidleware')
const adminMiddleware = require('../midlewere/adminRegister');




authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
// //getProfile
// authRouter.get('getProfile',getProfile);


//register
//login
//logout // validata the token 
module.exports = authRouter;