<template>
    <div class="the-editor-box">
        <BoilingPointEditor @publish="" placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见呦~"/>
        <Pinterest url="/books" :start="1" :query="{topicID: topicID}" @load="onLoad">
            <template v-slot:content>
                <div>
                    <div class="book-list">
                        <BoilingPointItem :key="item.id" v-for="item in boilingPoints" :data="item" />
                    </div>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import BoilingPointEditor from '~/js/components/editor/BoilingPointEditor.vue';
import BoilingPointItem from '~/js/components/boilingpoint/BoilingPointItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        let topicID = window.topicID;
        return {
            boilingPoints: [],
            topicID: parseInt(topicID, 10),
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.boilingPoints = this.boilingPoints.concat(result.data.data.list);
        }
    },
    components: {
        BoilingPointEditor,
        Pinterest,
        BoilingPointItem,
    },
}
</script>

<style scoped>
.the-editor-box {
    background: #fff;
    padding: 20px;
    padding-bottom: 6px;
}

.the-editor-box .comment-editor-box {
    margin-top: 0;
}
</style>

