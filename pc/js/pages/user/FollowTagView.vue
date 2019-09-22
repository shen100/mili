<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">关注</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/follows`" class="sub-type">关注了</router-link>
                <router-link :to="`/users/${author.id}/followers`" class="sub-type">粉丝</router-link>
                <router-link :to="`/users/${author.id}/followtags`" class="sub-type active">关注标签</router-link>
            </div>
        </div>
        <Pinterest :url="`/tags/users/${author.id}/follow`" @load="onLoad">
            <template v-slot:loading>
                <div class="tag-load-placeholder">
                    <div class="tag-load-img"></div>
                    <div class="tag-load-content">
                        <div class="tag-load-text tag-load-delay"></div>
                    </div>
                    <div class="tag-load-follower-btn"></div>
                </div>
            </template>
            <template v-slot:content>
                <div>
                    <ul>
                        <TagItem :key="tag.id" :tag="tag" v-for="tag in tags" />
                    </ul>
                </div>
            </template>
        </Pinterest>
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import TagItem from '~/js/components/tag/TagItem.vue';

export default {
    data () {
        return {
            author: window.author,
            tags: [],
            isEmpty: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                this.tags = this.tags.concat(result.data.data.list);
                if (!result.data.data.count) {
                    this.isEmpty = true;
                }
            }
        }
    },
    components: {
        Pinterest,
        TagItem,
    }
}
</script>

<style scoped>
.tag-load-placeholder {
    position: relative;
    padding: 20px;
    margin-bottom: 50px;
    overflow: hidden;
    background: #fff;
}

.tag-load-img {
    width: 45px;
    height: 45px;
    border-radius: 2px;
    margin-right: 20px;
    float: left;
    background-color: #eaeaea;
}

.tag-load-delay {
    -webkit-animation: loading 1s ease-in-out -.5s infinite!important;
    animation: loading 1s ease-in-out -.5s infinite!important;
}

.tag-load-content {
    width: 50%;
    padding-top: 13px;
    float: left;
}

.tag-load-text {
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.tag-load-follower-btn {
    width: 74px;
    height: 30px;
    margin-top: 7px;
    float: right;
    background-color: #eaeaea;
}
</style>
