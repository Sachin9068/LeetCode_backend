
const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../midlewere/adminRegister');
const CreateProblem = require('../controllers/userProblem')


problemRouter.post('/create',adminMiddleware,CreateProblem);
problemRouter.patch('update/:id',adminMiddleware,UpdateProblem);
problemRouter.delete('/:id',adminMiddleware,DeleteProblem);

// problemRouter.get('/:id',getProblemByid);
// problemRouter.get('/',getAllProblem);
// problemRouter.get('/user',solvedAllProblembyUser);


module.exports = problemRouter;
//problem
//create 
//fetch
//update
//delete