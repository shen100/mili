<template>
    <div id="app">
        <nav class="top-nav">
            <div class="width-limit">
                <a class="logo" href="/">
                    <img :src="`${imgPath}/logo.png`">
                </a>
                <UserDropdown :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
                <a class="btn write-btn" href="/editor/drafts/new" target="_blank">
                    <i class="iconfont ic-write"></i>写文章
                </a>
            </div>
        </nav>
        <ul class="draft-list">
            <li :key="i" v-for="(draft, i) in list">
                <div class="draft-item">
                    <a :href="`/editor/drafts/${draft.id}.html`" class="title">{{draft.name || '无标题'}}</a>
                    <div class="info-box">
                        <img v-if="draft.isMarkdown" class="markdown-icon" src="../../../images/editor/markdown.svg">
                        <div class="word-count">{{draft.wordCount || 0}} 字</div>
                        <div class="dot">·</div>
                        <div class="date">{{draft.createdAtStr}}</div>
                        <div v-clickoutside="onClickOutsideMenu" :data-index="i" class="menu">
                            <i @click="onMenuToggle(i)" class="iconfont ic-others"></i>
                            <ul v-if="listToggled[i].toggled" class="menu-list">
                                <li @click="onEditDraft(draft.id)" class="item">编辑</li>
                                <li @click="onDeleteDraft(draft.id)" class="item">删除</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import { ArticleContentType } from '~/js/constants/article.js';
import { myHTTP } from '~/js/common/net.js';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            imgPath: window.globalConfig.imgPath,
            page: 1,
            count: 0,
            limit: 0,
            list: [],
            listToggled: []
        };
    },
    methods: {
        onEditDraft(id) {
            location.href = `/editor/drafts/${id}.html`;
        },
        onDeleteDraft(id) {

        },
        onMenuToggle(index) {
            this.listToggled[index].toggled = !this.listToggled[index].toggled;
        },
        onClickOutsideMenu(event, dataset) {
            this.listToggled[dataset.index].toggled = false;
        }
    },
    mounted () {
        const url = '/editor/drafts';
        myHTTP.get(url).then((result) => {
            const data = result.data.data;
            this.page = data.page;
            this.count = data.count;
            this.limit = data.limit;
            const list = data.list || [];
            this.list = this.list.concat(list);
            list.forEach(item => {
                item.isMarkdown = item.contentType === ArticleContentType.Markdown;
                this.listToggled.push({toggled: false});
            });
        });
    },
    components: {
        UserDropdown,
    }
}
</script>
