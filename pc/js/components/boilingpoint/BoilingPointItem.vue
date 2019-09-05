<template>
    <li class="boilingpoint-item">
        <div class="boilingpoint-item-pin">
            <div class="pin-header-row">
                <div class="account-group">
                    <div class="user-popover-box">
                        <a :href="`/users/${data.user.id}`" target="_blank" class="user-link">
                            <div class="lazy avatar avatar loaded" :style="{'background-image': `url(${data.user.avatarURL})`}"></div>
                        </a>
                    </div>
                    <div  class="pin-header-content">
                        <div class="user-popover-box">
                            <a :href="`/users/${data.user.id}`" target="_blank" class="username">{{data.user.username}}</a>
                        </div>
                        <div class="meta-box">
                            <template v-if="data.user.job || data.user.company">
                                <div class="position ellipsis">{{data.user.job}}{{data.user.company ? ' @ ' + data.user.company : ''}}</div>
                                <div class="dot">·</div>
                            </template>
                            <a href="" target="_blank" class="time-box">
                                <time class="time">{{data.createdAtLabel}}</time>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="header-action">
                    <button class="subscribe-btn follow-button">关注</button>
                    <div v-clickoutside="clickoutsideReport" class="pin-header-more header-menu">
                        <div @click="onReport" class="more-button">
                            <svg t="1529034629100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1948" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" class="icon">
                                <path d="M804.606221 432.282401c120.691803 0 119.469975 187.388854-1.465374 187.388854C682.449044 619.671255 683.426301 432.282401 804.606221 432.282401z" p-id="1949" fill="#b8c1cc"></path>
                                <path d="M511.428995 432.282401c120.691803 0 119.469975 187.388854-1.465374 187.388854C389.271818 619.671255 390.249075 432.282401 511.428995 432.282401z" p-id="1950" fill="#b8c1cc"></path>
                                <path d="M218.251769 432.282401c120.691803 0 119.469975 187.388854-1.465374 187.388854C96.094592 619.671255 97.071849 432.282401 218.251769 432.282401z" p-id="1951" fill="#b8c1cc"></path>
                            </svg>
                        </div>
                        <transition name="custom-classes-transition"
                                enter-active-class="animated fadeIn faster"
                                leave-active-class="animated fadeOut faster">
                            <div v-if="reportVisible" class="dropdown1">
                                <div class="dropdown-caret"></div>
                                <ul class="dropdown-menu1">
                                    <li data-v-3deae11c="">举报</li>
                                </ul>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="pin-content-row ">
                <div class="content-box" v-html="data.htmlContent"></div>
            </div>
            <div class="pin-image-row">
                <div class="image-box-wrapper image-box">
                    <div class="image-box col-1">
                        <div :key="i" v-for="(img, i) in imgArr" class="image" :style="{'background-image': `url(${img})`}">
                            <div class="ratio-holder"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="data.topic" class="pin-topic-row">
                <a href="" target="_blank" title="" class="topic-title">{{data.topic.name}}</a>
            </div>
            <div class="pin-action-row">
                <div class="action-box action-box">
                    <div class="like-action action">
                        <div @click="onLikeOrNot(data)" class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon like-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <template v-if="!data.userLiked">
                                        <path d="M0 0h20v20H0z"></path>
                                        <path stroke="#8A93A0" stroke-linejoin="round" d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"></path>
                                    </template>
                                    <template v-else>
                                        <path d="M0 0h20v20H0z"></path>
                                        <path stroke="#37C700" stroke-linejoin="round" d="M5.344 8.833V17H4.072C3.482 17 3 16.424 3 15.716V10.22c0-.739.502-1.387 1.072-1.387h1.272zM10.6 4.166c.106-.693.692-1.179 1.335-1.166.918.018 1.465.777 1.655 1.153.346.686.356 1.816.118 2.542-.215.657-.713 1.52-.713 1.52h3.732c.395 0 .762.193 1.006.526.248.341.33.784.218 1.187l-1.69 6.08c-.153.584-.662.992-1.236.992H7.219V8.504c1.686-.361 3.191-3.086 3.381-4.338z" fill="#37C700" stroke-width=".964"></path>
                                    </template>    
                                </g>
                            </svg>
                            <span class="action-title" :style="{color: data.userLiked ? '#37c700' : '#8a93a0'}">{{data.likeCount ? data.likeCount : '赞'}}</span>
                        </div>
                    </div>
                    <div class="comment-action action">
                        <div class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon comment-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z"></path>
                                    <path stroke="#8A93A0" stroke-linejoin="round" d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"></path>
                                </g>
                            </svg>
                            <span class="action-title">{{data.commentCount}}</span>
                        </div>
                    </div>
                    <div class="share-action action">
                        <div class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon share-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z"></path>
                                    <g stroke="#8A93A0" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10 2.5v10M13.5 7h2.001c.552 0 .999.437.999.96v8.621c0 1.919-1.447 1.919-1.999 1.919H5.5c-.552 0-1.999 0-1.999-1.919v-8.62c0-.53.443-.961.999-.961H6.5M7.519 4.538L10.019 2l2.5 2.513"></path>
                                    </g>
                                </g>
                            </svg>
                            <span class="action-title">分享</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'data',
    ],
    data () {
        return {
            imgArr: this.data.imgs ? this.data.imgs.split(',') : [],
            reportVisible: false,
        };
    },
    methods: {
        onReport() {
            this.reportVisible = !this.reportVisible;
        },
        clickoutsideReport() {
            this.reportVisible = false;
        },
        onLikeOrNot(boilingPoint) {
            let url = `/boilingpoints/${boilingPoint.id}/like`;
            if (!boilingPoint.userLiked) {
                myHTTP.post(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        boilingPoint.userLiked = true;
                        boilingPoint.likeCount++;
                    }
                });
            } else {
                myHTTP.delete(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        boilingPoint.userLiked = false;
                        boilingPoint.likeCount--;
                    }
                });
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.boilingpoint-item {
    margin-bottom: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.boilingpoint-item-pin {
    background-color: #fff;
    border-radius: .2rem;
}

.pin-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 0 20px;
}

.pin-header-row .account-group {
    align-items: center;
}

.account-group, .header-action {
    display: flex;
}

.user-popover-box {
    display: inline;
}

.pin-header-row .user-link {
    font-size: 0;
}

.avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.lazy {
    position: relative;
}

.pin-header-row .avatar {
    flex: 0 0 auto;
    width: 45px;
    height: 45px;
    border-radius: 50%;
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

.lazy.loaded:before {
    opacity: 0;
    pointer-events: none;
}

.lazy:not(.immediate):before {
    transition: opacity .2s;
}

.pin-header-row .pin-header-content {
    margin-left: 12px;
}

.user-popover-box {
    display: inline;
}

.pin-header-row .username {
    font-size: 15px;
    font-weight: 600;
    color: #2e3135;
}

.pin-header-row .username:hover {
    text-decoration: none;
}

.pin-header-row .meta-box {
    display: flex;
    align-items: center;
    margin: 4px 0 0;
    font-size: 13px;
    color: #8a9aa9;
    cursor: default;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pin-header-row .meta-box .position {
    max-width: 288px;
}

.pin-header-row .meta-box .dot {
    margin: 0 6px;
}

.pin-header-row .meta-box .time-box {
    color: #8a9aa9;
}

.pin-header-row .meta-box .time-box:hover {
    text-decoration: none;
}

.account-group, .header-action {
    display: flex;
}

.subscribe-btn {
    border: 1px solid #37c700;
    background-color: #fff;
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border-color: #6cbd45;
    color: #6cbd45;
}

.pin-header-more {
    position: relative;
}

.header-menu {
    margin-left: 16px;
}

.more-button {
    cursor: pointer;
}

svg:not(:root) {
    overflow: hidden;
}

.dropdown1 {
    position: absolute;
    margin-top: 6px;
    z-index: 1;
    left: -30px;
}

.dropdown-caret, .dropdown-caret:after {
    position: absolute;
    top: -11px;
    left: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ebebeb;
}

.dropdown-caret {
    left: 36px;
}

.dropdown-caret:after {
    content: "";
    top: -5px;
    left: -6px;
    border-bottom-color: #fff;
}

.dropdown-menu1 {
    display: block;
    padding: 6px 0;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #ebebeb;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, .06);
}

.dropdown-menu1 li {
    padding: 6px 0;
    display: block;
    font-size: 13px;
    color: #84878b;
    width: 82px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
}

.dropdown-menu1 li:hover {
    color: #64686e;
    background-color: #f8f8f8;
}

.pin-content-row {
    margin-left: 77px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 5px;
    position: relative;
}

.content-box {
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    color: #17181a;
}

.pin-image-row, .pin-link-row, .pin-topic-row {
    position: relative;
    margin: 76px 48px 0 76px;
}

.image-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.image-box[data-v-206355b1] {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.image {
    flex: 0 1 auto;
    position: relative;
    margin-top: 4px;
    max-width: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: zoom-in;
}

.image-box.col-1 .image {
    width: 200px;
}

.image .ratio-holder {
    pointer-events: none;
}

.pin-topic-row {
    margin-top: 8px;
}

.pin-topic-row .topic-title {
    font-size: 13px;
    display: inline-block;
    line-height: 22px;
    padding: 0 12px;
    border: 1px solid #007fff;
    border-radius: 14px;
    color: #007fff;
    user-select: none;
}

.pin-topic-row .topic-title:hover {
    text-decoration: none;
}

.action-box {
    display: flex;
    position: relative;
    margin-top: 16px;
    height: 34px;
    border-top: 1px solid #ebebeb;
}

.like-action, .comment-action, .share-action {
    cursor: default!important;
}

.action {
    flex: 1 1 33.333%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    cursor: pointer;
    user-select: none;
}

.action-title-box {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.action-title-box .icon {
    width: 18px;
    height: 18px;
    font-size: 12px;
}

.action-title-box .action-title {
    margin-left: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #8a93a0;
    line-height: 18px;
    height: 18px;
    border: 1px solid transparent;
    box-sizing: border-box;
}

.action:not(:last-child):after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -12px;
    width: 1px;
    height: 24px;
    background-color: #ebebeb;
}

.follow-button:hover {
    opacity: .8;
}

.more-button:hover path {
    fill: #9da7b3;
}

.dropdown-caret:after {
    content: "";
    top: -5px;
    left: -6px;
    border-bottom-color: #fff;
}
</style>