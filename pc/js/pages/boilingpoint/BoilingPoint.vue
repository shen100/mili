<template>
    <div>
        <div class="the-editor-box">
            <BoilingPointEditor @publish="onPublish" placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见呦~"/>
        </div>
        <Pinterest :url="url" :start="1" :query="{topicID: topicID}" @load="onLoad">
            <template v-slot:content>
                <div>
                    <ul class="boilingpoint-list">
                        <BoilingPointItem :key="item.id" v-for="item in boilingPoints" :data="item" />
                    </ul>
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
        let topicID = parseInt(window.topicID, 10);
        let url = '/boilingpoints';
        if (window.boilingPointType) {
            url = `/boilingpoints/${window.boilingPointType}`;
        }
        return {
            url,
            boilingPoints: [],
            topicID: topicID || undefined,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            console.log('=====', result);
            this.boilingPoints = this.boilingPoints.concat(result.data.data.list);
        },
        onPublish() {

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

.boilingpoint-list {
    background: #f4f5f5;
    margin-top: 8px;
}
</style>

