<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">赞</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/like/articles`" class="sub-type">文章</router-link>
                <router-link :to="`/users/${author.id}/like/boilings`" class="sub-type active">沸点</router-link>
            </div>
        </div>
        <BoilingPoint :editorEnable="false" />
    </div>
</template>

<script>
import BoilingPoint from '~/js/pages/boilingpoint/BoilingPoint.vue';

export default {
    data() {
        return {
            author: window.author,
        };
    },
    methods: {
    },
    components: {
        BoilingPoint,
    }
}
</script>

<style lang="scss" scoped>
@import url(../../../styles/boilingpoint/boilingpoint.scss);
</style>