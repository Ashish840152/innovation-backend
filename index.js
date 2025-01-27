const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { userRouter } = require('./Router/userRouter');
const { taskRouter } = require('./Router/taskRouter');
const { notificationRouter } = require('./Router/notificationRouter');
const { createConnection, disConnectConnection } = require('./Controller/connectionController');
const { createNotification, getNotification, updateNotification, getAllNotificationForUser } = require('./Controller/notificationController');
require('./connection')();
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(userRouter);
app.use(taskRouter);
app.use(notificationRouter);

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
});

io.on('connection', async (socket) => {
    createConnection(socket.handshake.auth.token, socket.id);
    const userNotification = await getAllNotificationForUser(socket.handshake.auth.token);
    userNotification.forEach(async (notification) => {
        await updateNotification(notification);
        io.to(socket.id).emit('message', {
            senderId: socket.id,
            message: notification
        }
        );
    });
    console.log('connected');
    socket.on('sendNotification', async (data) => {
        await createNotification(data, socket.handshake.auth.token);
        const notifications = await getNotification();
        notifications.forEach(async (notification) => {
            await updateNotification(notification);
            const targetID = notification.device_id;
            io.to(targetID).emit('message', {
                senderId: socket.id,
                message: notification
            }
            );
        });
    })

    // socket.on('seennotification', async (data) => {
    //     await updateNotification(data);
    // })
    socket.on('disconnect', () => {
        console.log('Disconnected', socket.id);
        disConnectConnection(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
