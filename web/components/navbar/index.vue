<script  setup>
const el = ref(null);

const {data} = useAuth();
onMounted(() => {
    window.addEventListener('scroll', () => {
        let value = window.scrollY;
        let lastScrollTop = 0;

        if (el.value) {
            if (value > lastScrollTop) {
                el.value.classList.add('bg-white');
            } else {
                el.value.classList.remove('bg-white');
            }
        }
    });
});

</script>

<template>
    <div ref="el" class="flex p-2 justify-between fixed top-0 left-0 w-full z-50">
        <div class="text-xl">Chat</div>
        <div>
            <UAvatar :alt="`${data.user.username}`" />
        </div>
    </div>
</template>