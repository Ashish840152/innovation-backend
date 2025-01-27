const { Schema, model } = require('mongoose');

const connectionSchema = new Schema(
    {
        "user_id":{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
        "device_id": {
            type: String,
            required: true
        },
        "isDeleted": {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true },
);

const connectionModel = model('Connection', connectionSchema);

module.exports = {
    connectionModel
}