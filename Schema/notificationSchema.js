const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
    {
        "user_id":{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: ''
          },
        "title": {
            type: String,
            required: true
        },
        "seen": {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true },
);

const notificationModel = model('Notification', notificationSchema);

module.exports = {
    notificationModel
}