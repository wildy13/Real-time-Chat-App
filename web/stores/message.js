import { defineStore } from 'pinia';

const useChatStore = defineStore('chat', () => {
  const { socket } = useSocket();
  const messages = ref([]);

  function bindEvents() {
    socket.on('connect', () => {
      socket.emit('chat:list', async(res) => {
        const x = res.data.group.indexOf(socket._opts.user._id)
        if (res.data.group[x] === socket._opts.user._id) {
          this.messages = res.data.content
        }
      });
    });

    socket.on('chat:create', (message) => {
      this.messages.push(message);
    });
  }

  function create(message) {
    socket.emit('chat:create', message);
  }

  return { messages, bindEvents, create };
});

export default useChatStore;