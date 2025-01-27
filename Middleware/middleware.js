const { statusCode } = require("../Constant/constant");
const { generateError, verifyToken } = require("../Utils/utils");

const userVarification = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
         throw await generateError('Please login', statusCode['Unauthorized']);   
        }
        const token = req.headers.authorization.split(' ')[1];
        req.user = await verifyToken(token,process.env.USER_SECRATE);
        next();    
    } catch (err) {
        res.status(err.status).send(err)
    }
}

const userVarify = async (token) => {
    try {
        return await verifyToken(token,process.env.USER_SECRATE);   
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    userVarification,
    userVarify
}
