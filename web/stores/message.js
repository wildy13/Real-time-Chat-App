import { defineStore } from 'pinia';

const useChatStore = defineStore('chat', () => {
  const { socket } = useSocket();

  const messages = ref([]);

  function bindEvents() {
    socket.on('connect', () => {
      socket.emit('chat:list', (res) => {
        this.messages = res.data;
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