<template>
    <div>
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            author: window.author,
            isEmpty: true,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
        }
    },
    components: {
    }
}
</script>