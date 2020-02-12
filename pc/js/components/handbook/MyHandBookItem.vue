<template>
    <div class="my-handbooks">
        <div class="info-box">
            <div class="meta-row">
                <a :href="`/uc/${handbook.user.id}`" class="username">{{handbook.user.username}}</a>
                <span class="time">{{handbook.createdAt | formatYMD}}</span>
            </div>
            <div class="info-row">
                <a :href="`/handbooks/${handbook.id}`" target="_blank" class="title">{{handbook.name}}</a>
                <span class="desc">{{handbook.summary}}</span>
            </div>
            <div class="action-row">
                <div class="action-left">
                    <span class="buy">购买人数: {{handbook.saleCount}}</span>
                    <span class="sale">价格: {{handbook.price | displayPrice}}元</span>
                </div>
                <div class="action-right">
                    <!-- <span>审核中</span>
                    <span class="read">人阅读</span> -->
                    <div v-clickoutside="clickoutsideMore" class="more">
                        <div @click="onShowMoreList">
                            <More />
                        </div>
                        <transition name="custom-classes-transition"
                                enter-active-class="animated fadeIn faster"
                                leave-active-class="animated fadeOut faster">
                            <ul v-if="moreListVisible" class="more-list">
                                <li class="item">
                                    <a :href="`/handbooks/${handbook.id}/chapters/introduce/edit`" target="_blank">编辑</a>
                                </li>
                                <li class="item">
                                    <a>查看结算数据</a>
                                </li>
                            </ul>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatYMD } from '~/js/utils/date.js';
import { displayPrice } from '~/js/utils/utils.js';
import More from '~/js/components/common/More.vue';

export default {
    props: [ 'handbook' ],
    data () {
        return {
            moreListVisible: false, // 是否显示更多下拉列表
        };
    },
    methods: {
         onShowMoreList() {
            this.moreListVisible = !this.moreListVisible;
        },
        clickoutsideMore() {
            this.moreListVisible = false;
        },
    },
    filters: {
        formatYMD,
        displayPrice,
    },
    components: {
        More,
    }
}
</script>

<style lang="scss" scoped>
.my-handbooks {
    padding: 24px 28px;
    background: #fff;
    border-bottom: 1px solid rgba(230, 230, 231, 0.5);
}

.my-handbooks .meta-row .username {
    color: #3b76c5;
    margin-right: 10px;
    font-size: 12px;
}

.my-handbooks .meta-row .username:hover {
    text-decoration: none;
}

.my-handbooks .meta-row .time {
    color: #84878b;
    font-size: 12px;
}

.my-handbooks .info-row {
    margin: 8px 0 12px;
}

.my-handbooks .info-row .title {
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.my-handbooks .info-row .title:hover {
    text-decoration: none;
}

.my-handbooks .info-row .desc {
    font-size: 14px;
    margin-top: 10px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.my-handbooks .action-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.my-handbooks .action-row span {
    margin-right: 10px;
}

.my-handbooks .action-row .action-left {
    font-size: 12px;
    color: #84878b;
}

.my-handbooks .action-row .action-right {
    font-size: 12px;
    color: #84878b;
    display: flex;
    align-items: center;
}

.my-handbooks .action-row .action-right .more {
    font-size: 14px;
    color: #84878b;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.my-handbooks .action-row .action-right .more-list {
    position: absolute;
    top: 100%;
    left: 0;
    white-space: nowrap;
    color: #84878b;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 #e0e4e9;
    border: 1px solid rgba(217, 222, 224, .99);
    z-index: 10;
}

.my-handbooks .action-row .action-right .more-list .item a {
    color: #84878b;
    display: block;
    padding: 6px 10px;
}

.my-handbooks .action-row .action-right .more-list .item a:hover {
    color: #84878b;
    text-decoration: none;
    background-color: #f8f8f8;
}
</style>