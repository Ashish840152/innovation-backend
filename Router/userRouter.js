const express = require('express');
const userRouter = express.Router();
const { userVarification } = require('../Middleware/middleware');
const { 
    signup,
    login, 
    changePassword,
    sendOtp,
    verifyUser,
    userList,
    userListAsPerLogin
  } = require('../Controller/userController');

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/changepassword', userVarification, changePassword);
userRouter.post('/sendotp', sendOtp);
userRouter.post('/verifyUser',verifyUser);
userRouter.get('/userlist', userList);
userRouter.get('/userlistbylogin', userVarification, userListAsPerLogin);


module.exports = {
    userRouter,
  };