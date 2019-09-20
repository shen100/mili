<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">专栏</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/follows`" class="sub-type">关注了</router-link>
                <router-link :to="`/users/${author.id}/followers`" class="sub-type active">粉丝</router-link>
                <router-link :to="`/users/${author.id}/followtags`" class="sub-type active">关注标签</router-link>
            </div>
        </div>
        <Pinterest :url="`/users/${author.id}/follows`" :start="1" @load="onLoad">
            <template v-slot:loading>
                <div style="padding: 20px; padding-top: 10px;">
                    <ArticleLoading />
                </div>
            </template>
            <template v-slot:content>
                <div>
                    <a :key="user.id" :href="`/users/${user.id}`" v-for="user in users" target="_blank" class="link user-follow-item">
                        <div class="lazy avatar avatar loaded" :style="{'background-image': `url(${user.avatarURL})`}"></div>
                        <div class="info-box">
                            <a :href="`/user/${user.id}`" target="_blank" class="username">{{user.username}}
                                <a href="/book/5c" target="_blank" class="the-rank">
                                    <img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-6.74bd93a.svg">
                                </a>
                            </a>
                            <div class="detail">{{user | jobCompany}}</div>
                        </div>
                        <button class="follow-btn active">已关注</button>
                    </a>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import { jobCompany } from '~/js/common/filters.js';
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            author: window.author,
            users: [],
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.users = this.users.concat(result.data.data.list);
        }
    },
    filters: {
        jobCompany,
    },
    components: {
        ArticleLoading,
        ArticleItem,
        Pinterest,
    }
}
</script>

<style lang="scss" scoped>
.link {
    display: flex;
    align-items: center;
    padding: 6px 28px;
    min-height: 84px;
}

.avatar[data-v-7a297ff6] {
    flex: 0 0 auto;
    margin-right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.lazy:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: inherit;
    border-radius: inherit;
}

.lazy:not(.immediate):before {
    transition: opacity .2s;
}

.lazy.loaded:before {
    opacity: 0;
    pointer-events: none;
}

.info-box {
    flex: 1 1 auto;
    min-width: 0;
}

.info-box .username {
    font-size: 16px;
    font-weight: 600;
    color: #2e3135;
}

.info-box .detail {
    margin-top: 7px;
    font-size: 12px;
    font-weight: 500;
    color: #b9c0c8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.follow-btn.active {
    color: #fff;
    background-color: #92c452;
}

.follow-btn {
    flex: 0 0 auto;
    margin: 0 0 0 12px;
    padding: 0;
    width: 90px;
    height: 30px;
    font-size: 12px;
    color: #92c452;
    background-color: #fff;
    border: 1px solid #92c452;
    border-radius: 2px;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.the-rank {
    vertical-align: baseline!important;
}

.user-follow-item:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
    text-decoration: none;
}

.user-follow-item .username:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
    text-decoration: none;
}
</style>