<script setup>
import { onKeyStroke, useScroll } from '@vueuse/core'
import useChatStore from '../../stores/message'

const route = useRoute();
const { data } = useAuth();
const { socket } = useSocket();

socket.off();

const store = useChatStore();

store.bindEvents();

const state = ref({
    msg: undefined,
    sender: data.value.user._id,
    recipient: route.params.id,
})
const input = ref();
const msg = ref(null)

onKeyStroke('Enter', (e) => {
    if (e) {
        e.preventDefault()
        store.create(state.value);
        state.value.msg = undefined
    }
}, { target: input });

onUpdated(() => {
    setTimeout(scrollToBottom, 100);
});

const scrollToBottom = ()  =>{
    if(msg.value)  {
        window.scrollTo(0, msg.value.scrollHeight)
    }
}
</script>

<template>
    <div>
        <div  ref="msg" class="py-12">
            <div v-for="item in store.messages" :key="item._id" class="flex items-center p-4"
            
                :class="{ 'justify-end': item.sender._id === data.user._id }">
                <div>
                    <UAvatar :alt="`${item.sender.username}`" class="bg-white" size="lg" />
                </div>
                <div class="px-2 py-1 bg-white rounded-lg mx-2 max-w-xs">
                    <div class="text-semibold text-sm text-yellow-500">{{ item.sender?.username }}</div>
                    <div>{{ item.msg }}</div>
                </div>
            </div>

        </div>
        <div class="fixed bottom-0  left-0 w-full bg-white  p-1 flex justify-center items-center  space-x-4">
            <div>
                <UIcon name="i-heroicons-plus" class="w-6 h-6" />
            </div>
            <div>
                <UInput ref="input" :ui="{ rounded: 'rounded-xl' }" v-model="state.msg"></UInput>
            </div>
            <div>
                <UIcon name="i-heroicons-camera" class="w-6 h-6" />
            </div>
            <div>
                <UIcon name="i-heroicons-microphone" class="w-6 h-6" />
            </div>
        </div>
    </div>
</template>

