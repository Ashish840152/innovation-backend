const { createConnectionService, disConnectConnectionService } = require('../Service/connectionService');
const { userVarify } = require('../Middleware/middleware');

const createConnection = async (token, deviceId) => {
    try {
        const result = await userVarify(token);
        const data = {
            "user_id": result._id,
            "device_id": deviceId
        }
        return await createConnectionService(data);
    } catch (err) {
        console.log(err);
    }
};

const disConnectConnection = async (deviceId) => {
    try {
        return await disConnectConnectionService(deviceId);
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    createConnection,
    disConnectConnection
}