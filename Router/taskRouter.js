const express = require('express');
const taskRouter = express.Router();
const { userVarification } = require('../Middleware/middleware');
const { createTask, deleteTask, getTaskList, getUserTaskList, updateTask} = require('../Controller/taskController');

taskRouter.post('/createtask', userVarification, createTask);
taskRouter.put('/deletetask', userVarification, deleteTask);
taskRouter.get('/alltask', userVarification, getTaskList);
taskRouter.get('/usertask', userVarification, getUserTaskList);
taskRouter.put('/updatetask', userVarification, updateTask);
module.exports = {
    taskRouter,
};