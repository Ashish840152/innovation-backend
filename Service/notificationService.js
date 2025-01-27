const { notificationModel } = require('../Schema/notificationSchema');
const { generateError, sendResponse, createNotificationData } = require("../Utils/utils");
const { statusCode } = require('../Constant/constant');
const { saveData, findByIdAndUpdate, findAll } = require('../Dao/dao');
const { connectionModel } = require('../Schema/ConnectionSchema');

const createNotificationService = async (req, token) => {
    try {
        const { user_id } = req;
        req = await createNotificationData(req, token);
        for (let i = 0; i < user_id.length; i++) {
            req.user_id = user_id[i];
            await saveData(notificationModel, req);
        }
        return;
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const getNotificationData = async () => {
    try {
        const pipeline = [
            {
                $match: { isDeleted: false }
            },
            {
                $lookup: {
                    from: 'notifications',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'notifications'
                }
            },
            {
                $unwind: '$notifications'
            },
            {
                $match: {
                    'notifications.seen': false
                }
            },
            {
                $project: {
                    _id: 0,
                    user_id: '$user_id',
                    device_id: 1,
                    title: '$notifications.title',
                    notificationId: '$notifications._id'
                }
            }
        ];
        const results = await connectionModel.aggregate(pipeline);
        return results;
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}

const updateNotificationService = async (data) => {
    try {
        let { notificationId } = data;
        if (!notificationId) {
            notificationId = data._id;
        }
        const updateNotification = await findByIdAndUpdate(notificationModel, notificationId, { seen: true });
        if (!updateNotification) {
            throw await generateError('Notification not found', statusCode['Not Found']);
        }
        return await sendResponse('Notification has been updated', updateNotification);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}

const getAllNotificationForUserService = async (data) => {
    try {
        const { _id } = data;
        const result = await findAll(notificationModel,{user_id: _id, seen: false});
        return result;
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}

module.exports = {
    createNotificationService,
    updateNotificationService,
    getNotificationData,
    getAllNotificationForUserService
};