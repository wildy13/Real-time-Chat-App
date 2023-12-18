<script setup>
import {useUsersStore} from '../../stores/users'

const store  = useUsersStore();

const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => store.getAll(), {
    immediate: false,
});

onMounted(async () => {
    await execute();
});
</script>

<template>
    <div v-for="user in store.items" :key="user._id">
        <NuxtLink :to="`chat/${user._id}`">
            <span>{{ user.username }}</span>
        </NuxtLink>
    </div>
</template>