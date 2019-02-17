<template>
    <div class="editor-header">
        <div class="editor-logo-box" :style="{width: `${logoBoxWidth}px` }"></div>
        <input v-if="!isRich" v-model="articleTitle" class="editor-title-input" type="text" placeholder="输入标题..." />
        <div v-else class="editor-no-header-title"></div>
        <div class="user-actions-box">
            <NavUser :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
            <div class="publish-popup">
                <div class="toggle-btn">
                    <span class="publish-popup-btn">发布</span>
                    <i class="fa fa-caret-down"></i>
                    <i class="fa fa-caret-up"></i>
                </div>
                <div class="panel">
                    <div class="title">发布文章</div>
                    <div class="category-box">
                        <div class="sub-title">分类</div>
                        <div class="category-list">
                            <div :key="i" v-for="(c, i) in hotCategories" :class="{active: selectCategoryIndex === i}" class="item">{{c.name}}</div>
                        </div>
                    </div>
                    <div class="category-box">
                        <div class="sub-title">标签</div>
                        <div class="user-category-list"></div>
                        <div class="tag-input tag-input">
                            <input type="text" placeholder="添加1个标签" class="input">
                        </div>
                    </div>
                    <button class="publish-btn">确定并发布</button>
                </div>
            </div>
            <div class="editor-more-btn">
                <i class="iconfont ic-others"></i>
                <div class="switch-editor">切换为 Markdown 编辑器</div>
            </div>
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
            articleTitle: '',
            selectCategoryIndex: 0,
            hotCategories: [
                {
                    id: 1,
                    name: 'Android'
                },
                {
                    id: 2,
                    name: '前端'
                },
                {
                    id: 3,
                    name: 'iOS'
                },
                {
                    id: 4,
                    name: '产品'
                },
                {
                    id: 5,
                    name: '设计'
                },
                {
                    id: 6,
                    name: '工具资源'
                },
                {
                    id: 7,
                    name: '阅读'
                },
                {
                    id: 8,
                    name: '后端'
                },
                {
                    id: 9,
                    name: '人工智能'
                },
                {
                    id: 10,
                    name: '运维'
                }
            ]
        }
    },
    methods: {
        onPublish() {
            
        },
    },
    components: {
        NavUser,
    }
}
</script>