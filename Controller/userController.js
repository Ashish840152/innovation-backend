
const {
  signupService,
  loginService,
  changePasswordService,
  sendOtpService,
  verifyUserService,
  userListService,
  userByloginService
} = require('../Service/userService');

const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);
    if (result.success) {
      res.status(result.status).send(result);
    } else {
      res.status(result.error.status).send(result);
    }
  } catch (err) {
    console.log(err);

    res.status(err.status).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(result.status).send(result);
  } catch (err) {
    console.log(err);
    res.status(err.status).send(err.message);
  }
}

const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService(req);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const sendOtp = async (req, res) => {
  try {
    const result = await sendOtpService(req.body.email);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const verifyUser = async (req, res) => {
  try {
    const result = await verifyUserService(req.body);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const userList = async (req, res) => {
  try {
    const result = await userListService();
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const userListAsPerLogin = async (req, res) => {
  try {
    console.log(req.user);
    const result = await userByloginService(req.user);
    
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}
module.exports = {
  signup,
  login,
  changePassword,
  sendOtp,
  verifyUser,
  userList,
  userListAsPerLogin
};