<template>
    <!-- 已学习的用户列表 或 已购买的用户列表 -->
    <div class="related-user-list-modal">
        <button @click="onClose" type="button" class="close-btn">×</button>
        <h1 class="title">{{title}}</h1>
        <ul class="user-list">
            <Pinterest :url="url" @load="onLoad">
                <template v-slot:content>
                    <li :key="user.id" v-for="user in users" class="item">
                        <div class="user">
                            <a :href="`/uc/${user.id}`" target="_blank">
                                <div class="avatar" :style="{'background-image': `url(${user.avatarURL})`}"></div>
                            </a>
                            <div class="user-info">
                                <a :href="`/uc/${user.id}`" target="_blank" class="username">{{user.username}}</a>
                                <div class="intro">{{user | jobCompany}}</div>
                            </div>
                        </div>
                    </li>
                </template>
            </Pinterest>
        </ul>
    </div>
</template>

<script>
import Pinterest from '~/js/components/common/Pinterest.vue';
import { jobCompany } from '~/js/common/filters.js';
import { getWindowSize } from '~/js/utils/dom.js';

export default {
    props: ['type', 'bookID'],
    data() {
        return {
            visible: true,
            users: [],
            url: this.type == 'book' ? `/books/${this.bookID}/studyusers` : '',
            styleNode: null,
        }
    },
    computed: {
        title() {
            return {
                'book': '已学习用户',
                'handbook': '已购买用户',
            }[this.type];
        },
    },
    mounted() {
        const winSize = getWindowSize();
        const node = document.createElement('style');
        const str = `.container { height: ${winSize.height - 80 - 60 - 20}px; overflow: hidden; }`; 
        node.type = 'text/css'; 
        if (node.styleSheet) {
            node.styleSheet.cssText = str;
        } else {
            node.innerHTML = str; 
        }
        document.getElementsByTagName('head')[0].appendChild(node);
        this.styleNode = node;
    },
    beforeDestroy() {
        if (this.styleNode) {
            document.getElementsByTagName('head')[0].removeChild(this.styleNode);
        }
    },
    methods: {
        onLoad(result) {
            this.users = this.users.concat(result.data.data.list);
        },
        onClose() {
            this.$emit('close');
        }
    },
    components: {
        Pinterest,
    },
    filters: {
        jobCompany,
    }
}
</script>

<style lang="scss">
.related-user-list-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: hsla(0, 0%, 100%, .95);
    overflow-y: auto;
    z-index: 2000;
}

.related-user-list-modal .close-btn {
    position: fixed;
    font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    line-height: 1;
    color: #000;
    opacity: .6;
    filter: alpha(opacity=20);
    font-weight: 200;
    outline: none;
    text-shadow: none;
    padding: 0;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    top: 24px;
    right: 36px;
    font-size: 32px;
    cursor: pointer;
}

.related-user-list-modal .title {
    margin: 60px 0 24px 0;
    text-align: center;
    font-size: 24px;
}

.related-user-list-modal .user-list {
    margin: auto;
    padding: 0 0 24px;
    width: 480px;
    max-width: 90%;
}

.related-user-list-modal .user-list .item {
    padding: 12px 0;
}

.related-user-list-modal .user {
    display: flex;
    align-items: center;
}

.related-user-list-modal .avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 16px;
}

.related-user-list-modal .user-info {
    flex: 1 1 auto;
    overflow: hidden;
}

.related-user-list-modal .username {
    font-size: 15px;
    font-weight: 600;
    color: #2e3135;
}

.related-user-list-modal .username:hover {
    text-decoration: none;
}

.related-user-list-modal .intro {
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>