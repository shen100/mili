<template>
    <!-- 个人中心关注的标签用到了此组件 -->
    <li class="tag-item">
        <div class="tag">
            <a :href="`/tags/${tag.id}`" target="_blank" class="tag-link">
                <div class="tag-thumb" :style="{'background-image': `url(${tag.iconURL})`}"></div>
                <div class="title">{{tag.name}}</div>
                <FollowBtn ref="followBtn" @followChange="onFollowChange" :tagID="tag.id" :followed="true"></FollowBtn>
            </a>
        </div>
    </li>
</template>

<script>
import FollowBtn from '~/js/components/user/FollowBtn.vue';

export default {
    props: [
        'tag',
        'followed',
    ],
    data() {
        return {
            isFollowed: this.followed,
        };
    },
    methods: {
        onFollowChange(tagID, isFollowed) {
            this.isFollowed = isFollowed;
            this.$emit('followChange', tagID, isFollowed);
        },
        changeTagFollow(tagID, isFollowed) {
            if (tagID === this.tag.id) {
                this.isFollowed = isFollowed;
                this.$refs['followBtn'].changeFollow(tagID, isFollowed);
            }
        },
    },
    components: {
        FollowBtn,
    }
}
</script>

<style scoped>
.tag-item:not(:last-child) {
    border-bottom: 1px solid rgba(230, 230, 231, .5);
}

.tag-item .tag {
    position: relative;
    box-sizing: border-box;
    background: #fff;
}

.tag-item .tag-link {
    display: flex;
    align-items: center;
    padding: 6px 28px;
    min-height: 84px;
}

.tag-item .tag-link:hover {
    text-decoration: none;
}

.tag-item .tag-thumb {
    background-position: 50%;
    background-repeat: no-repeat;
    position: relative;
    flex: 0 0 auto;
    margin-right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 2px;
    background-size: contain;
}

.tag-item .tag-thumb:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: inherit;
    border-radius: inherit;
}

.tag-item .tag-thumb:not(.immediate):before {
    transition: opacity .2s;
}

.tag-item .tag-thumb:before {
    opacity: 0;
    pointer-events: none;
}

.tag-item .title {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2e3135;
}
</style>
