import { get } from './controller.js';

export default ((fastify, opts, done) => {
  fastify.get('/', get);
  done();
});