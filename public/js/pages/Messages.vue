<template>
    <div id="app" class="message">
        <Side />
        <div class="content-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Side from '~/js/components/messages/Side.vue';

export default {
    name: 'App',
    components: {
        Side,
    }
};
</script>
