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
