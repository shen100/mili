<template>
    <div class="book-card">
        <div class="header header-equal">
            <div v-if="starUserCount" @click="changeSelect('star')" class="header-item" :class="{selected: type === 'star'}">图书评价</div>
            <div v-if="commentCount" @click="changeSelect('comment')" class="header-item" :class="{selected: type === 'comment'}">章节留言</div>
        </div>
        <div class="comments-book">
            <div class="comments-list">
                <div :key="star.id" v-for="star in stars" class="comment">
                    <div class="aside">
                        <a :href="`/uc/${star.user.id}`" target="_blank" class="user">
                            <div class="lazy avatar loaded" :style="{'background-image': `url(${star.user.avatarURL})`}"></div>
                        </a>
                    </div>
                    <div class="content-box">
                        <div class="comment-header">
                            <a :href="`/uc/${star.user.id}`" target="_blank" class="username">{{star.user.username}}<a :href="userLevelChapterURL" target="_blank" class="rank">
                                <img :src="star.user.level | levelImgURL"></a>
                            </a>
                            <div v-if="type === 'star'" class="star-panel">
                                <div :key="i" v-for="i in 5" class="star" :class="{'star-selected': i <= star.star}" style="cursor: default;"></div>
                            </div>
                        </div>
                        <div class="content">
                            <span class="content-html" v-html="star.htmlContent"></span>
                        </div>
                        <div class="footer-line">
                            <span class="date">{{star.createdAtLabel}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="totalPage > 1" class="border-sep"></div>
        <Paging v-if="totalPageGeted" :page="page" :totalPage="totalPage" @change="onPageChange" />
    </div>
</template>

<script>
import { levelImgURL } from '~/js/common/filters.js';
import Paging from '~/js/components/common/Paging.vue';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

export default {
    props: ['type', 'bookID', 'starUserCount', 'commentCount'],
    data() {
        return {
            stars: [
            ],
            page: 1,
            totalPage: 0,
            totalPageGeted: false,
            userLevelChapterURL: window.userLevelChapterURL,
        };
    },
    mounted() {
        this.reqList();
    },
    methods: {
        changeSelect(select) {
            this.$emit('change', select);
        },
        reqList() {
            let url;
            if (this.type == 'star') {
                url = `/books/${this.bookID}/stars?page=${this.page}&pageSize=5`;
            } else if (this.type == 'comment') {
                url = `/comments/collection/book/${this.bookID}?page=${this.page}&pageSize=5`;
            }
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.stars = res.data.data.list;
                    this.page = res.data.data.page;
                    this.totalPage = Math.ceil(res.data.data.count / res.data.data.pageSize);
                    this.totalPageGeted = true;
                }
            });
        },
        onPageChange(page) {
            this.page = page;
            this.reqList();
        }
    },
    filters: {
        levelImgURL,
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

.book-card .header .header-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    padding-left: 25px;
    padding-right: 25px;
    cursor: pointer;
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

.username:hover {
    text-decoration: none;
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

.border-sep {
    border-top: 1px solid #eceded;
}
</style>