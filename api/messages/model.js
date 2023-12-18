import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

const schema = new Schema({
  _id: { type: String, default: () => nanoid(12) },
  group: [{ type: String, ref: 'Users' }],
  content: [{
    _id: { type: String, default: () => nanoid(12) },
    msg: String,
    sender: { type: String, ref: 'Users' },
    recipient: { type: String, ref: 'Users' },
  }],
}, { timestamps: true });


export default model('Messages', schema, 'messages');