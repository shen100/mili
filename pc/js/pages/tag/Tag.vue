<template>
    <div style="padding-top: 60px;">
        <div class="view-nav">
            <div class="tag-nav">
                <ul class="nav-list">
                    <li @click="onTagNavClick('subscribed')" class="nav-item" :class="{active: type !== 'all'}">
                        <a href="javascript:void(0)" class="text-muted1">已关注标签</a>
                    </li>
                    <li @click="onTagNavClick('all')" class="nav-item router-link-exact-active route-active" :class="{active: type === 'all'}">
                        <a href="javascript:void(0)" class="text-muted1">全部标签</a>
                    </li>
                </ul>
            </div>
        </div>
        <header v-if="type === 'all'" class="list-header">
            <nav class="list-nav">
                <ul class="nav-list">
                    <li @click="onSortNavClick('popular')" class="nav-item" :class="{active: query.sort === 'popular'}">
                        <a>最热</a>
                    </li>
                    <li @click="onSortNavClick('newest')" class="nav-item" :class="{active: query.sort === 'newest'}">
                        <a>最新</a>
                    </li>
                    <li class="nav-item search">
                        <input v-model="tempInputQ" @keyup.enter="onSearch" maxlength="32" placeholder="搜索标签" class="search-input">
                    </li>
                </ul>
            </nav>
        </header>
        <div class="tag-box" :style="{'padding-top': type === 'all' ? '0' : '20px'}">
            <Pinterest ref="tagPinterest" :url="url" @load="onLoad">
                <template v-slot:content>
                    <div>
                        <TagInfo @cancel="onFollowCancel(tag.id)" :key="tag.id" :tag="tag" v-for="tag in tags" />
                    </div>
                </template>
            </Pinterest>
            <div v-if="!isLoading && !tags.length" class="status text-muted">列表为空</div>
        </div>
    </div>
</template>

<script>
import Pinterest from '~/js/components/common/Pinterest.vue';
import TagInfo from '~/js/components/tag/TagInfo.vue';
import { trim } from '~/js/utils/utils.js';

export default {
    data () {
        const type = 'subscribed'; // subscribed、all
        return {
            userID: window.userID,
            type,
            tags: [],
            query: {
                sort: 'popular',
                q: '',
            },
            tempInputQ: '',
            isLoading: true,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    computed: {
        isSearch() {
            if (this.type === 'all') {
                const q = trim(this.tempInputQ);
                if (q) {
                    return true;
                }
            }
            return false;
        },
        url() {
            if (this.type === 'all') {
                const q = trim(this.tempInputQ);
                if (q) {
                    // 搜索标签
                    return '/tags/search';
                }
                // 全部标签
                return '/tags';
            }
            // 关注的标签
            return `/tags/users/${this.userID}/follow`;
        }
    },
    methods: {
        onLoad(result) {
            this.tags = this.tags.concat(result.data.data.list);
            this.isLoading = false;
        },
        onTagNavClick(type) {
            if (type === this.type) {
                return;
            }
            this.type = type;
            this.isLoading = true;
            this.tags = [];
            this.$nextTick(() => {
                let query = null;
                if (type === 'all') {
                    query = this.isSearch ? this.query : { sort: this.query.sort };
                }
                this.$refs.tagPinterest.refresh(query);
            });
        },
        onSortNavClick(sort) {
            if (sort === this.query.sort) {
                return;
            }
            this.isLoading = true;
            this.tags = [];
            this.query = {
                ...this.query,
                sort,
            };
            this.$nextTick(() => {
                this.$refs.tagPinterest.refresh(this.isSearch ? this.query : { sort });
            });
        },
        onSearch(event) {
            this.isLoading = true;
            this.tags = [];
            this.query = {
                ...this.query,
                q: event.target.value,
            };
            this.$nextTick(() => {
                this.$refs.tagPinterest.refresh(this.isSearch ? this.query : { sort : this.query.sort });
            });
        },
        onFollowCancel(tagID) {
            if (this.type === 'all') {
                return;
            }
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].id === tagID) {
                    this.tags.splice(i, 1);
                    break;
                }
            }
        }
    },
    components: {
        Pinterest,
        TagInfo,
    }
}
</script>

<style scoped>
.view-nav {
    width: 100%;
    height: 46px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    transition: all .2s;
    transform: translateZ(0);
}

.tag-nav {
    width: 960px;
    height: 100%;
    margin: auto;
}

.tag-nav .nav-list {
    align-items: center;
    line-height: 1;
    width: 960px;
    height: 100%;
    margin: auto;
    display: flex;
}

.nav-item {
    position: relative;
    cursor: pointer;
}

.tag-nav .nav-list .nav-item {
    height: 100%;
    flex-shrink: 0;
    color: #71777c;
    align-items: center;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    padding: 0 12px;
    border-bottom: 2px solid transparent;
    transition: border-bottom .3s, color .3s;
}

.tag-nav .nav-list .nav-item:first-child {
    padding: 0 12px 0 0;
}

.tag-nav .nav-list .nav-item:hover .text-muted1 {
    color: #ea6f5a;
}

.text-muted1 {
    color: #909090;
}

.text-muted1:hover {
    text-decoration: none;
}

.nav-item>a:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.tag-nav .nav-list .nav-item:last-child {
    padding: 0 0 0 12px;
}

.tag-nav .nav-list .nav-item.active, .tag-nav .nav-list .nav-item:hover {
    color: #ea6f5a;
}

.tag-nav .nav-list .nav-item.active, .tag-nav .nav-list .nav-item:hover {
    border-bottom-color: #ea6f5a;
}

.tag-nav .nav-list .nav-item.active a {
    color: #ea6f5a;
}

.tag-box {
    width: 960px;
    margin: 0 auto;
}

.list-header {
    width: 960px;
    margin: 0 auto;
    padding: 16px 12px;
    border-bottom: none;
}

.list-header .list-nav, .list-header .nav-list {
    display: flex;
    justify-content: space-between;
}

.nav-list {
    display: flex;
    flex-wrap: wrap;
}

.list-header .nav-list {
    align-items: center;
    line-height: 1;
}

.nav-item {
    position: relative;
    cursor: pointer;
}

.nav-list .nav-item {
    padding: 7px 12px;
    margin-left: 10px;
    font-size: 16px;
    white-space: nowrap;
}

.list-header .nav-list .nav-item a {
    color: #909090;
}

.list-header .nav-list .nav-item.active a, .list-header .nav-list .nav-item a:hover {
    color: #ea6f5a;
    text-decoration: none;
}

.nav-list .nav-item.search .search-input {
    padding: 6px;
    font-size: 14px;
    border: 1px solid hsla(0, 0%, 59.2%, .2);
    outline: none;
}

.status {
    padding: 24px 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
    color: #666;
}
</style>
