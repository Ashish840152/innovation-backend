const { createNotificationService, updateNotificationService, getNotificationData, getAllNotificationForUserService} = require('../Service/notificationService');
const { userVarify } = require('../Middleware/middleware');

const createNotification = async (data, token) => {
    try {
        const result = await createNotificationService(data,token);
        return result;
    } catch (err) {
        console.log(err);
    }
};

const getNotification = async () => {
    try {
        const result = await getNotificationData();
        return result;
    } catch (err) {
        console.log(err);
    }
};

const updateNotification = async (data) => {
    try {
        console.log('update notification',data);
        
        const result = await updateNotificationService(data);
        return result;
    } catch (err) {
        console.log(err);
    }
};

const getAllNotificationForUser = async (data) => {
    try {
        const userData = await userVarify(data);
        const result = await getAllNotificationForUserService(userData);
        return result;
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    createNotification,
    updateNotification,
    getNotification,
    getAllNotificationForUser
}