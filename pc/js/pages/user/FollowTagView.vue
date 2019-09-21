<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">专栏</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/follows`" class="sub-type">关注了</router-link>
                <router-link :to="`/users/${author.id}/followers`" class="sub-type">粉丝</router-link>
                <router-link :to="`/users/${author.id}/followtags`" class="sub-type active">关注标签</router-link>
            </div>
        </div>
        <Pinterest :url="`/tags/users/${author.id}/follow`" @load="onLoad">
            <template v-slot:content>
                <div>
                    <ul>
                        <TagItem :key="tag.id" :tag="tag" v-for="tag in tags" />
                    </ul>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import TagItem from '~/js/components/tag/TagItem.vue';

export default {
    data () {
        return {
            author: window.author,
            tags: []
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.tags = this.tags.concat(result.data.data.list);
        }
    },
    components: {
        Pinterest,
        TagItem,
    }
}
</script>

<style scoped>
</style>

