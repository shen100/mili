<template>
    <div class="handbooks">
        <!--
        <Pinterest :url="`/handbooks/users/${author.id}/buy`" @load="onLoad">
            <template v-slot:content>
                <div>
                    <ul>
                        <HandBookItem :key="handbook.id" :handbook="handbook" v-for="handbook in handbooks" />
                    </ul>
                </div>
            </template>
        </Pinterest> -->
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>


<script>
import HandBookItem from '~/js/components/handbook/HandBookItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            author: window.author,
            handbooks: [],
            isEmpty: true,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.handbooks = this.handbooks.concat(result.data.data.list);
        }
    },
    components: {
        HandBookItem,
        Pinterest,
    }
}
</script>