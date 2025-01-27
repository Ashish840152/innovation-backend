const { taskModel } = require("../Schema/taskSchema");
const { userModel } = require("../Schema/userSchema");
const { findOne, saveData, deleteID, findByQuery, findByIdAndUpdate } = require("../Dao/dao");
const { statusCode } = require('../Constant/constant');
const { generateError, sendResponse } = require("../Utils/utils");

const createTaskService = async (req) => {
    try {
        const { role } = req.user;
        const { title } = req.body;
        if ( role !== "Manager") {
            const err = new Error("User does not have enough permissions to create task");
            err.status = statusCode.Unauthorized;
            throw err; 
        }
        if (!title) {
            const err = new Error(error.message);
            err.status = statusCode.Unauthorized;
            throw err;
        }
        const query = { title };
        const taskFound = await findOne(taskModel, query);
        if (taskFound) {
            const error = new Error('Task already exist');
            error.status = statusCode['Already Reported'];
            throw error;
        }
        const taskDate = await saveData(taskModel, req.body);
        return await sendResponse('Task has been created', taskDate);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const deleteTaskService = async (req) => {
    try {
        const { role } = req.user;
        const { _id } = req.body;
        if ( role !== "Manager") {
            throw await generateError('User does not have enough permissions to create task', statusCode['Unauthorized']);
        }
        const deletedTask = await deleteID(taskModel, _id);
        if (!deletedTask) {
            throw await generateError('Task not found', statusCode['Not Found']);
        }
        return await sendResponse('Task has been deleted', deletedTask);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const getTaskService = async (req) => {
    try {
        const user_id  = req.user._id
        const { role } = req.user;
        let taskList = [];
        console.log(user_id,role);
        
        if ( role === 'Employee') {
            taskList = await taskModel.find({user_id});
        } else if ( role === 'Team leader' ) {
            const userList = await userModel.find({isDeleted: false, teamLead: user_id});
            userIds = userList.map(user => user._id);
            userIds.push(user_id);
            taskList = await taskModel.find({ user_id: { $in: userIds } });
        } else {
            taskList = await taskModel.find({});
        }
        return await sendResponse('Task list', taskList);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const getUserTaskService = async (req) => {
    try {
        const { _id } = req.user;
        const query = { user_id: _id };
        const userTaskList = await findByQuery(taskModel, query);
        return await sendResponse('Task list', userTaskList);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}

const updateTaskService = async (req) => {
    try {
        const { _id } = req;
        const updatedTask = await findByIdAndUpdate(taskModel, _id, req);
        if (!updatedTask) {
            throw await generateError('Task not found', statusCode['Not Found']);
        }
        return await sendResponse('Task has been updated', updatedTask);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}
module.exports = {
    createTaskService,
    deleteTaskService,
    getTaskService,
    getUserTaskService,
    updateTaskService,
}