const { createTaskService, deleteTaskService, getTaskService, getUserTaskService, updateTaskService } = require("../Service/taskService");

const createTask = async (req, res) => {
    try {
        const result = await createTaskService(req);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const deleteTask = async (req, res) => {
    try {
        const result = await deleteTaskService(req);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const getTaskList = async (req, res) => {
    try {        
        const result = await getTaskService(req);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const getUserTaskList = async (req, res) => {
    try {        
        const result = await getUserTaskService(req);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const updateTask = async (req, res) => {
    try {        
        const result = await updateTaskService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

module.exports = {
    createTask,
    deleteTask,
    getTaskList,
    getUserTaskList,
    updateTask
}