<template>
    <li id="topnavsearch" class="search">
        <form target="_blank" action="/search" accept-charset="UTF-8" method="get">
            <input type="text" name="q" value="" autocomplete="off" placeholder="搜索" class="search-input">
            <a class="search-btn" href="javascript:void(0)">
                <i class="iconfont ic-search"></i>
            </a>
            <div id="navbar-search-tips">
                <div class="search-trending">
                    <div class="search-trending-header clearfix">
                        <span>热门搜索</span> 
                        <a><i class="iconfont ic-search-change" style="transform: rotate(0deg);"></i> 换一批</a>
                    </div> 
                    <ul class="search-trending-tag-wrap">
                        <li :key="trending.id" v-for="trending in trendingArr"><a href="" target="_blank">{{trending.label}}</a></li>
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

export default {
    name: 'TopNavSearch',
    data: function() {
        return {
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
    }
}
</script>