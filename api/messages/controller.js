import Messages from './model.js';

export const get  = async (req,res) => {
    try {
        const messages = await Messages.findById('MrIy9CD9ESb9')
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
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send(error)
    }
}

/* export const getMessage = async (connection, req) => {        
    connection.socket.on('message', async (message) => {
        const data = JSON.parse(message.toString());

        const messages = await Messages.findById('MrIy9CD9ESb9');
        messages.content.push(data);        
        await messages.save();
        
        await messages.populate({
            path: 'content',
            populate: {
                path: 'sender',
                select: '-password'
            },
        });
        await messages.populate({
            path: 'content',
            populate: {
                path: 'recipient',
                select: '-password'
            },
        });

        connection.socket.send(JSON.stringify(messages.content));
    })
}; */
