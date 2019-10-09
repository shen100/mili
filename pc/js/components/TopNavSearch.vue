<template>
    <li id="topnavsearch" class="search">
        <form v-clickoutside="onClickOutside" target="_blank" action="/search" accept-charset="UTF-8" method="get">
            <input type="hidden" name="q" :value="keyword"> 
            <input v-model="searchKeyword" @focus="onFocus" type="text" autocomplete="off" placeholder="搜索" class="search-input">
            <a class="search-btn" :href="`/search?q=${encodedKeyword}`" target="_blank">
                <i class="iconfont ic-search"></i>
            </a>
            <div v-if="searchTipVisible" id="navbar-search-tips">
                <div class="search-trending">
                    <div class="search-trending-header clearfix">
                        <span>热门搜索</span> 
                        <a><i class="iconfont ic-search-change" style="transform: rotate(0deg);"></i> 换一批</a>
                    </div> 
                    <ul class="search-trending-tag-wrap">
                        <li :key="trending.id" v-for="trending in trendingArr"><a :href="`/search?q=${encodeURIComponent(trending.label)}`" target="_blank">22{{trending.label}}</a></li>
                    </ul>
                </div>
                <div class="search-recent">
                    <ul class="search-recent-item-wrap">
                        <li :key="recent.id" v-for="recent in recentArr">
                            <a href="" target="_blank">
                                <i class="iconfont ic-search-history"></i> 
                                <span>{{recent.label}}</span> 
                                <i class="iconfont ic-unfollow"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </li>
</template>

<script>
import { trim } from '~/js/utils/utils.js';

export default {
    name: 'TopNavSearch',
    data: function() {
        return {
            searchTipVisible: false,
            searchKeyword: '',
            trendingArr: [
                { label: '区块链' },
                { label: '小程序' },
                { label: 'vue' },
                { label: '毕业' },
                { label: 'PHP' },
                { label: '故事' },
                { label: 'flutter' },
                { label: '理财' },
            ],
            recentArr: [
                { label: 'vue' },
                { label: 'java' },
                { label: 'golang' },
                { label: 'js' },
                { label: 'ts' },
            ]
        };
    },
    computed: {
        encodedKeyword: {
            get: function () {
                let k = this.searchKeyword;
                k = trim(k || '');
                return encodeURIComponent(k);
            },
        },
        keyword: {
            get: function () {
                let k = this.searchKeyword;
                k = trim(k || '');
                return k;
            },
        }
    },
    methods: {
        onFocus() {
            this.searchTipVisible = false;
        },
        onClickOutside() {
            this.searchTipVisible = false;
        }
    }
}
</script>