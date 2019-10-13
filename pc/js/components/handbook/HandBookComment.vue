<template>
    <div class="book-card">
        <div class="header header-equal">
            <div @click="changeSelect('star')" class="header-item" :class="{selected: select === 'star'}">图书评价</div>
            <div @click="changeSelect('comment')" class="header-item" :class="{selected: select === 'comment'}">章节留言</div>
        </div>
        <div class="comments-book">
            <div class="comments-list">
                <div :key="star.id" v-for="star in stars" class="comment">
                    <div class="aside">
                        <a href="/user/5666fbb400b0a9f1b6ce3e90" target="_blank" class="user">
                            <div class="lazy avatar avatar loaded" style="background-image: url(g?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1&quot;);"></div>
                        </a>
                    </div>
                    <div class="content-box">
                        <div class="comment-header">
                            <a :href="`/uc/${star.user.id}`" target="_blank" class="username">{{star.user.username}}<a href="" target="_blank" class="rank">
                                <img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-2.f597b88.svg" alt="lv-2"></a>
                            </a>
                            <div v-if="select === 'star'" class="star-panel">
                                <div :key="i" v-for="i in 5" class="star" :class="{'star-selected': i <= star.value}"></div>
                            </div>
                        </div>
                        <div class="content">
                            <span class="content-html" v-html="star.htmlContent"></span>
                        </div>
                        <div class="footer-line">
                            <span class="date">4月前</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Paging />
    </div>
</template>

<script>
import Paging from '~/js/components/common/Paging.vue';

export default {
    props: ['select'],
    data() {
        console.log('=============>');
        return {
            stars: [
            ]
        };
    },
    mounted() {
        console.log('=============> mounted');
        this.stars = [
            {
                value: 4,
                user: {
                    id: 44,
                    username: this.select,
                    avatarURL: 'https://mirror-gold-cdn.xitu.io/168e0909374b6025cee?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1'
                },
                htmlContent: '内容丰富、充实，值得好好阅读。不过前面基本 Widget 介绍过多，希望能多点小的案例实践一下，提高阅读体验！',
                createdAt: '2018-10-10T08:54:33.000Z',
            },
            {
                value: 3,
                user: {
                    id: 45,
                    username: 'taokexia',
                    avatarURL: 'https://mirror-gold-cdn.xitu.io/168e0909374b6025cee?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1'
                },
                htmlContent: '内容丰富、充实，值得好好阅读。不过前面基本 Widget 介绍过多，希望能多点小的案例实践一下，提高阅读体验！',
                createdAt: '2018-10-10T08:54:33.000Z',
            }
        ];
    },
    methods: {
        changeSelect(select) {
            this.$emit('change', select);
        }
    },
    components: {
        Paging,
    }
}
</script>

<style lang="scss" scoped>
.book-card {
    max-width: 720px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 12px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
    background-color: #fff;
}

.book-card .header {
    display: flex;
    border-bottom: 1px solid #eceded;
    font-size: 16px;
    background-color: #fff;
    color: #232323;
}

.book-card .header.header-equal {
    cursor: pointer;
}

.book-card .header .header-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    padding-left: 25px;
    padding-right: 25px;
}

.book-card .header.header-equal .selected {
    color: #ea6f5a;
    box-shadow: inset 0 -2px 0 #ea6f5a;
}

.comments-list {
    padding-bottom: 5px;
}

.comments-list .comment {
    background-color: #fff;
    padding-left: 20px;
    padding-right: 40px;
    padding-top: 12px;
    display: flex;
}

.avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.comments-list .comment .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
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

.comments-list .comment .content-box {
    flex-grow: 1;
    margin-left: 15px;
}

.comments-list .comment .content-box .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    line-height: 32px;
}

.username {
    font-size: 15px;
    font-weight: 600;
    color: #2e3135;
}

.rank {
    margin-left: 4px;
    vertical-align: middle;
}

.star-panel {
    display: flex;
}

.star-panel .star {
    width: 15px;
    height: 15px;
    background-image: url(../../../images/handbook/star.svg);
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    cursor: pointer;
}

.star-panel .star.star-selected {
    background-image: url(../../../images/handbook/star_selected.svg);
    background-size: contain;
}

.star-panel .star:not(:last-child) {
    margin-right: 2px;
}

.comments-list .comment .content-box .content {
    font-size: 15px;
    padding-bottom: 10px;
    text-align: justify;
}

.comments-list .comment .content-box .content {
    font-size: 15px;
    padding-bottom: 10px;
    text-align: justify;
}

.comments-book .footer-line {
    display: flex;
    justify-content: flex-end;
    color: #b1bac2;
    font-size: 14px;
    padding-bottom: 10px;
}

.comments-book .footer-line {
    display: flex;
    justify-content: flex-end;
    color: #b1bac2;
    font-size: 14px;
    padding-bottom: 10px;
}
</style>