const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
    {
        "user_id": {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: []
        },
        "title": {
            type: String, 
            required: true
        },
        "description": {
            type: String,
            default: ''
        },
        "status": {
            type: String,
            enum: ['To Do', 'In Progress', 'Completed'],
            default: 'To Do'
        },
        "priority": {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        "due_date": {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true },
);

const taskModel = model('Task', taskSchema);

module.exports = {
    taskModel
}