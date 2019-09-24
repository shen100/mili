<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">赞</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/like/articles`" class="sub-type">文章</router-link>
                <router-link :to="`/users/${author.id}/like/boilings`" class="sub-type active">沸点</router-link>
            </div>
        </div>
        <BoilingPoint :maxMiddleImgWidth="584" :editorEnable="false" :url="`/boilingpoints/user/${author.id}/like`" 
            :loadingStyle="loadingStyle" :userID="userID" @empty="onEmpty" />
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>

<script>
import BoilingPoint from '~/js/pages/boilingpoint/BoilingPoint.vue';

export default {
    data() {
        return {
            author: window.author,
            userID: window.userID,
            isEmpty: false,
            loadingStyle: {
                animationWidth: '460px'
            }
        };
    },
    methods: {
        onEmpty() {
            this.isEmpty = true;  
        },
    },
    components: {
        BoilingPoint,
    }
}
</script>

<style lang="scss" scoped>
@import url(../../../styles/boilingpoint/boilingpoint.scss);
</style>