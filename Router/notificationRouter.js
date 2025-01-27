const express = require('express');
const notificationRouter = express.Router();
const { userVarification } = require('../Middleware/middleware');
const { createNotification, updateNotification} = require('../Controller/notificationController');

notificationRouter.post('/createnotification', userVarification, createNotification);
notificationRouter.put('/updatenotification', userVarification, updateNotification);

module.exports = {
    notificationRouter,
};
