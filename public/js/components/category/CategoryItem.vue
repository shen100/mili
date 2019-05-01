<template>
    <div class="item">
        <a :href="`/category/${categoryData.id}.html`" target="_blank" class="searchcategory">
            <div class="info-box">
                <a :href="`/category/${categoryData.id}.html`" target="_blank">
                    <div class="lazy thumb thumb loaded" :style="{'background-image': `url(${categoryData.coverURL})`, 'background-size': 'contain'}"></div>
                </a>
                <div class="meta-box">
                    <div class="title" v-html="categoryData.name"></div>
                    <div class="stat">
                        <span class="subscribe">{{categoryData.followerCount || 0}} 关注 · </span>
                        <span class="article">{{categoryData.articleCount || 0}} 文章</span>
                    </div>
                </div>
            </div>
            <div class="action-box">
                <button @click.stop.prevent="onFollow" @mouseenter="onMouseenter" @mouseleave="onMouseleave"
                    class="follow-button follow-btn" :class="{'followed': isFollowed}">{{followText}}</button>
            </div>
        </a>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { replaceIgnoreCase } from '~/js/utils/utils.js';

export default {
    props: [
        'keyword',
        'category',
    ],
    data () {
        const strongHTML = `<em style="color: #e8001c">${this.keyword}</em>`;
        const categoryData = {
            ...this.category,
            name: replaceIgnoreCase(this.category.name, this.keyword, strongHTML),
        };
        return {
            isFollowed: categoryData.isFollowed,
            isMouseEnter: false,
            categoryData,
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
            const url = `/categories/${this.categoryData.id}/follow`;
            let reqMethod;
            if (this.isFollowed) {
                reqMethod = myHTTP.delete;
            } else {
                reqMethod = myHTTP.post;
            }
            reqMethod(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isFollowed = !this.isFollowed;
                }
            });
        },
    }
}
</script>

<style scoped>
.item:not(:last-child) {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.no-border-bottom {
    border-bottom: none;
}

.searchcategory {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}

.searchcategory:hover {
    text-decoration: none;
}

.searchcategory .info-box {
    display: flex;
}

.searchcategory .thumb {
    width: 45px;
    height: 45px;
}

.searchcategory .meta-box {
    margin-left: 30px;
}

.searchcategory .meta-box .title {
    font-size: 14px;;
    font-weight: 600;
    color: #2e3135;
    margin-bottom: 8px;
}

.searchcategory .meta-box .title em {
    font-style: normal;
    color: #e8001c;
}

.searchcategory .meta-box .stat {
    font-size: 13px;
    color: #2e3135;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.button, button {
    -webkit-appearance: none;
    appearance: none;
    background-color: #007fff;
    color: #fff;
    border-radius: 2px;
    border: none;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.follow-button {
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #6cbd45;
    color: #6cbd45;
    background-color: #fff;
}

.searchcategory .action-box .follow-btn {
    padding: 0;
    width: 74px;
    height: 30px;
}

.thumb {
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
}

.searchcategory:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
}

.follow-button.followed {
    color: #fff;
    border-color: #6cbd45;
    background-color: #6cbd45;
}

.follow-btn:hover {
    opacity: .8;
}
</style>



