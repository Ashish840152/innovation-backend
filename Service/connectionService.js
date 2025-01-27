const { connectionModel } = require('../Schema/ConnectionSchema.js');
const { generateError, sendResponse } = require("../Utils/utils");
const { statusCode } = require('../Constant/constant');
const { saveData, findByIdAndUpdate, findOne, findAll } = require('../Dao/dao');
const { connectionSchema } = require("../Validation/validation.js");

const createConnectionService = async (req) => {
    try {
        const { error } = connectionSchema.validate(req);    
        if (error) {
          throw await generateError(error.message, statusCode['Bad Request']);
        }        
        const findConnection = await findAll(connectionModel, {user_id: req.user_id, isDeleted: false});
        await connectionModel.updateMany( { _id: { $in: findConnection.map(conn => conn._id) } }, { $set: { isDeleted: true } } );
        const connectionData = await saveData(connectionModel, req);
        return await sendResponse('Connection has been created', connectionData);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const disConnectConnectionService = async (req) => {
    try {
        const query = {device_id : req};
        const connectionData = await findOne(connectionModel, query);
        if (!connectionData) {
            throw await generateError('Connection not found', statusCode['Not Found']);
        }
        const { _id } = connectionData;
        const updateConnection = await findByIdAndUpdate(connectionModel, _id, {isDeleted : true});
        return await sendResponse('Connection has been deleted', updateConnection);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

module.exports = {
    createConnectionService,
    disConnectConnectionService
}

