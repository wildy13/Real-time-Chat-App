import { get, create } from './controller.js';

export default ((fastify, opts, done) => {
  fastify.get('/', get);
  fastify.post('/', create);
  done();
});