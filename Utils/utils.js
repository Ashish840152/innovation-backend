const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { statusCode } = require('../Constant/constant');
const { userVarify } = require('../Middleware/middleware');

const getHashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);
        return pass;
    } catch (err) { 
        throw err;
    }
}

const comparePassword = async (password, encriptPassword) => {    
   const isPasswordCorrect = await bcrypt.compare(password, encriptPassword);
   return isPasswordCorrect;
}

const generateToken = async (data, secrate) => {
    try {
        data = JSON.stringify(data);
        return jwt.sign(data, secrate);
    } catch (err) {
        throw err;
    }
}

const generateError = async (message, status) => {    
    const err = new Error(message);
    err.status = status;
    return err;
}

const verifyToken = async (token, secrate) => {
    const data = await jwt.verify(token, secrate);
    return data;
}

const sendResponse = async (message, responseData) => {
    return {
        success: true,
        status: statusCode['OK'],
        message,
        response: responseData
    }
}

const sendMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_OTP_MAIL,
                pass: process.env.SEND_OTP_PASSWORD
            }
        });
        
        const htmlTemplate = fs.readFileSync('Template/otp.html', 'utf-8');
        const formattedHtml = htmlTemplate.replace('{{otp}}', otp);
        
        const mailOptions = {
            from: process.env.SEND_OTP_MAIL,
            to: email,
            subject: 'Your OTP',
            html: formattedHtml
        };
        
        await transporter.sendMail(mailOptions);       
       return {
        success: true,
        status: statusCode['OK'],
        message: 'Otp has been send',
        otp
       }
    } catch (err) {
        throw await generateError('Internal error', statusCode['Internal Server Error']);
    }
}

const generateFourDigitOtp = async () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}

const sendEmailFromService = async (email, htmlTamplate, subject) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_OTP_MAIL,
                pass: process.env.SEND_OTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SEND_OTP_MAIL,
            to: email,
            subject: subject,
            html: htmlTamplate
        };

        await transporter.sendMail(mailOptions);
        return {
         success: true,
         status: statusCode['OK'],
         message: 'Email has been send',
        }
    } catch (err) {

    }
}

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  }

const createNotificationData = async (data,token) => {
    const user = await verifyToken(token,process.env.USER_SECRATE);
    let title = '';
    if (data.type == 'DELETE') {
        title = `${user.name} deleted the Task ${data.title}`;
    } else if (data.type == 'ADD') {
        title = `${user.name} added the Task ${data.title}`;
    } else {
        title = `${user.name} updated the Task ${data.title}`;
    }
    return {
        title,
        user_id: data.user_id
    }
}

module.exports = {
    getHashPassword,
    comparePassword,
    generateToken,
    generateError,
    verifyToken,
    sendResponse,
    sendMail,
    generateFourDigitOtp,
    sendEmailFromService,
    giveCurrentDateTime,
    createNotificationData
}