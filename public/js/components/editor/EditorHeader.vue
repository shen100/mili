<template>
    <div class="editor-header">
        <div class="editor-logo-box" :style="{width: `${logoBoxWidth}px` }"></div>
        <input v-if="!isRich" v-model="articleTitle" class="editor-title-input" type="text" placeholder="输入标题..." />
        <div class="user-actions-box">
            <NavUser :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
            <a class="btn write-btn" @click="onPublish">
                <i class="iconfont ic-write"></i>发布
            </a>
            <div class="editor-more-btn"><i class="iconfont ic-others"></i></div>
            <div class="upload-cover"><div></div></div>
            <div class="auto-save">文章将会自动保存至<a href="/editor/drafts">草稿</a></div>
        </div>
    </div>
</template>

<script>
import NavUser from '~/js/components/common/NavUser.vue';

export default {
    props: [
        'isRich',
        'logoBoxWidth',
        'userID',
        'avatarURL'
    ],
    data () {
        return {
            articleTitle: ''
        }
    },
    methods: {
        onPublish() {
            
        }
    },
    components: {
        NavUser,
    }
}
</script>