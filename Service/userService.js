
const { userRegistrationSchema, userLoginSchema, changePasswordSchema, otpSchema } = require('../Validation/validation');
const { getHashPassword, comparePassword, generateToken, generateError, sendResponse, generateFourDigitOtp, sendMail } = require('../Utils/utils');
const { findOne, saveData, findOneAndUpdate } = require('../Dao/dao');
const { statusCode } = require('../Constant/constant');

const { userModel } = require('../Schema/userSchema');
const signupService = async (req) => {
    try {
      const { email } = req;
      const { error } = userRegistrationSchema.validate(req);
      if (error) {
        const err = new Error(error.message);
        err.status = statusCode.Unauthorized;
        throw err;
      }
      req.password = await getHashPassword(req.password);
  
      const query = { email, isDeleted: false };
      const studentFound = await findOne(userModel, query);
      if (studentFound) {
        const error = new Error('User already exist');
        error.status = statusCode['Already Reported'];
        throw error;
      }
      const userData = await saveData(userModel, req);
      return await sendResponse('User has been created', userData);
    } catch (error) {
      throw await generateError(error.message, statusCode['Bad Request']);
    }
  };
  
  const loginService = async (req) => {
  
    try {
      const { email, password } = req;
      const { error } = userLoginSchema.validate(req);
      if (error) {
        const err = new Error(error.message);
        err.status = statusCode.Unauthorized;
        throw err;
      }      
      const userData = await userModel.findOne({ email });
      if (!userData) {
        const err = new Error('There is no record found from that given data. Please give valid detail');
        err.status = statusCode['Not Found'];
        throw err;
      }

      if (!userData.isVerify) {
        throw await generateError('Please verify first', statusCode['Unauthorized']);
      }      
      const isPasswordCorrect = await comparePassword(password, userData.password);
  
      if (!isPasswordCorrect) {
        throw await generateError('Password is not correct', statusCode['Bad Request'])
      }
  
      const token = await generateToken(userData, process.env.USER_SECRATE);
  
      return await sendResponse('User has been loged in', { userData,token });
    } catch (error) {
      throw await generateError(error.message, error.status);
    }
  }
  
  const changePasswordService = async (req) => {
    try {
      const { error } = changePasswordSchema.validate(req.body);
      const { email } = req.user;
      const { password } = await findOne(userModel, { email });
      const { oldPassword, newPassword } = req.body
  
      if (error) {
        throw await generateError(error.message, statusCode['Bad Request'])
      }
  
      if (! await comparePassword(oldPassword, password)) {
        throw await generateError('Please give right old password', statusCode['Unauthorized']);
      }
  
      const hashPassword = await getHashPassword(newPassword);
  
      const changedData = await findOneAndUpdate(userModel, { email }, { password: hashPassword });
  
      return await sendResponse('Password has been changed', changedData);
    } catch (err) {
      throw await generateError(error.message, error.status);
    }
  }

  const sendOtpService = async (email) => {
    try {
      if (!email) {
        throw await generateError('Please provide require info', statusCode['Bad Request']);
      }
      const otp = await generateFourDigitOtp();
      const userData = await findOneAndUpdate(userModel, { email }, { otp });

      if (!userData){
        throw await generateError('User not found', statusCode['Not Found']);        
      }
      return await sendMail(email, otp);
  
    } catch (err) {
      throw await generateError(err.message, err.status);
    }
  }

  const verifyUserService = async (req) => {
    try {
      const { error } = otpSchema.validate(req);
      const { email, otp } = req;
  
      if (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
      }
  
      const userData = await findOne(userModel, { email });
      if (!userData) {        
        throw await generateError('User not found', statusCode['Not Found']);
      }
      if (otp == userData.otp) {
        const result = await findOneAndUpdate(userModel, { email }, { isVerify: true });
        return await sendResponse('Student has been verify', result);
      }
  
      throw await generateError('Please give correct otp', statusCode['Unauthorized']);
    } catch (error) {
      throw await generateError(error.message, error.status);
    }
  }

  const userListService = async () => {
    try {
      const users = await userModel.find({});
      return await sendResponse('User List', users);
    } catch (err) {
      throw await generateError(err.message, err.status);
    }
  }

  const userByloginService = async (req) => {
    try {
      const { role, _id } = req;
      let users = [];
      if ( role == "Manager") {
        users = await userModel.find({ role: { $in: ["Team leader", "Employee"] }, isDeleted: false});
      } else if (role == "Team leader")
      {
        users = await userModel.find({ teamLead: _id, isDeleted: false});
      } else {
        users = [];
      }
      console.log(users);
      
      return await sendResponse('User List', users);
    } catch (err) {
      throw await generateError(err.message, err.status);
    }
  }

  module.exports = {
    signupService,
    loginService,
    changePasswordService,
    sendOtpService,
    verifyUserService,
    userListService,
    userByloginService
  };