<template>
    <div class="handbooks">
        <div class="sub-header">
            <div class="sub-header-title">小册</div>
            <div class="sub-type-box">
                <router-link :to="`/uc/${author.id}/buyhandbooks`" class="sub-type">购买的</router-link>
                <router-link :to="`/uc/${author.id}/writehandbooks`" class="sub-type active">撰写的</router-link>
            </div>
        </div>
        <Pinterest :url="`/handbooks/users/${author.id}/my`" @load="onLoad">
            <template v-slot:content>
                <div>
                    <ul>
                        <MyHandBookItem :key="handbook.id" :handbook="handbook" v-for="handbook in handbooks" />
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
import MyHandBookItem from '~/js/components/handbook/MyHandBookItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data () {
        return {
            author: window.author,
            handbooks: [],
            isEmpty: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(res) {
            if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                this.handbooks = this.handbooks.concat(res.data.data.list || []);
            }
            if (this.handbooks.length <= 0) {
                this.isEmpty = true;
            }
        }
    },
    components: {
        MyHandBookItem,
        Pinterest,
    }
}
</script>