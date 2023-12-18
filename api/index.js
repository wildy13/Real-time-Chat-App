import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

import { connect } from 'mongoose';

import User from './users/model.js';
import Messages from './messages/model.js';
import setup from './auth/passport.js';

import auth from './auth/index.js';
import users from './users/index.js';
import messages from './messages/index.js';
import fastifySocketIO from 'fastify-socket.io';


const fastify = Fastify({
    logger: true,
});

setup(User);

fastify.register(fastifyCors);
fastify.register(fastifyJwt, { secret: process.env.SESSION_KEY, sign: { expiresIn: '8h' } });
fastify.register(fastifySocketIO, {
    cors: {
        origin: 'http://190.1.6.248:4000',
    },
});

fastify.addHook('onRequest', async (req, res) => {
    try {
        if (req.headers.authorization) {
            await req.jwtVerify();
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


fastify.register(auth, { prefix: '/api/auth' });
fastify.register(users, { prefix: '/api/users' });
fastify.register(messages, { prefix: '/api/messages' });

fastify.ready((err) => {
    if (err) throw err;

    fastify.io.on('connect', (socket) => {
        console.info('Socket connected!', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('chat:list', async (callback) => {
            const messages = await Messages.find()
                .populate({
                    path: 'content',
                    populate: {
                        path: 'sender',
                        select: '-password'
                    },
                })
                .populate({
                    path: 'content',
                    populate: {
                        path: 'recipient',
                        select: '-password'
                    },
                });
                await Promise.all(
                    messages.map(async(val) => {
                        callback({ data: val });
                    })
                )
        });

        socket.on('chat:create', async (data) => {
            const { sender, recipient, msg } = data;

            try {
                const messageDocument = await Messages.findOne({
                    group: sender
                });

                if (!messageDocument) {
                    messageDocument = new Messages({
                        group: [sender, recipient],
                        content: [{ sender, recipient, msg }]
                    });
                } else {
                    messageDocument.content.push({ sender, recipient, msg });
                }

                const savedMessageDocument = await messageDocument.save();
                await messageDocument.populate({
                    path: 'content',
                    populate: {
                        path: 'sender',
                        select: '-password'
                    },
                });
                await messageDocument.populate({
                    path: 'content',
                    populate: {
                        path: 'recipient',
                        select: '-password'
                    },
                });

                socket.to('room_user_' + recipient).emit('chat:create', savedMessageDocument);

                const saved = messageDocument.content[messageDocument.content.length - 1]
                socket.broadcast.emit('chat:create', saved);
                socket.emit('chat:create', saved);

            } catch (error) {
                console.error('Error creating or updating message document:', error);
            }
        });

    });
});

const connector = async () => {
    try {
        await connect(process.env.DB_URL, {
            serializeFunctions: true,
        });

        console.log('Connection has been established successfully.');
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT, host: process.env.HOST });
        await connector();
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();