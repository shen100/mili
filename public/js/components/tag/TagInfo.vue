<template>
    <div class="item">
        <div class="tag">
            <div class="info-box">
                <a href="/tag/%" target="_blank">
                    <div class="lazy thumb loaded" :style="{'background-image': `url(${iconURL})`}"></div>
                    <div class="title">{{name}}</div>
                </a>
                <div class="meta-box">
                    <div class="meta subscribe">{{followerCount}} 关注</div>
                    <div class="meta article">{{articleCount}} 文章</div>
                </div>
            </div>
            <div class="action-box">
                <button @click.stop.prevent="onFollow" @mouseenter="onMouseenter" @mouseleave="onMouseleave"
                    class="subscribe-btn" :class="{subscribed: isFollowed}">{{followText}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'tag'
    ],
    data () {
        return {
            ...this.tag,
            isMouseEnter: false,
        };
    },
    computed: {
        followText() {
            if (this.isFollowed && this.isMouseEnter) {
                return '取消关注';
            }
            if (this.isFollowed) {
                return '已关注';
            }
            return '关注';
        }
    },
    methods: {
        onMouseenter() {
            this.isMouseEnter = true;
        },
        onMouseleave() {
            this.isMouseEnter = false;
        },
        onFollow () {
            const url = `/tags/${this.id}/follow`;
            let reqMethod;
            if (this.isFollowed) {
                reqMethod = myHTTP.delete;
            } else {
                reqMethod = myHTTP.post;
            }
            reqMethod(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isFollowed = !this.isFollowed;
                    if (this.isFollowed) {
                        this.followerCount++;
                    } else {
                        this.followerCount--;
                    }
                    this.$emit(this.isFollowed ? 'on-follow' : 'on-cancel');
                }
            });
        },
    }
}
</script>


<style scoped>
.button, button {
    -webkit-appearance: none;
    appearance: none;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: 6px 16px;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.item {
    width: 25%;
    display: inline-block;
    margin-bottom: 16px;
    padding: 0 8px;
    box-sizing: border-box;
}

.tag {
    display: inline-block;
    width: 100%;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    transition: border-color .3s;
    text-align: center;
    padding: 18px 0;
}

.lazy {
    position: relative;
}

.thumb {
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: 32px;
    margin: 12px auto;
    background-color: #fff;
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

.title {
    font-size: 18px;
    line-height: 24px;
    color: #333;
}

.meta-box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: #909090;
}

.meta-box .meta {
    line-height: 24px;
}

.meta-box .meta.article {
    margin-left: 10px;
}

.subscribe-btn {
    cursor: pointer;
    border: 1px solid #37c700;
    padding-left: 0;
    padding-right: 0;
    width: 76px;
    text-align: center;
    background-color: #fff;
    color: #37c700;
    margin: 12px auto;
    font-size: 13px;
}

.subscribe-btn.subscribed {
    background-color: #37c700;
    color: #fff;
}

.subscribe-btn.subscribed:hover {
    background-color: #3cb40e;
}

.info-box a:hover {
    text-decoration: none;
}
</style>

