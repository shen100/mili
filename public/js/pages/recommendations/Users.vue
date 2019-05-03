<template>
    <div class="recommend">
        <div class="recommend-user-list">
            <div :key="user.id" v-for="user in users" class="recommend-user-item">
                <div class="user-wrap">
                    <a target="_blank" :href="`/users/${user.id}.html`" class="avatarbox">
                        <img class="avatar" :src="user.avatarURL">
                        <h4 class="name">
                            {{user.username}}
                            <i class="iconfont ic-man"></i>
                        </h4>
                        <p class="description">{{user.introduce}}</p>
                    </a>
                    <BigFollow :userID="user.id" :userFollowed="user.isFollowed" />
                    <hr>
                    <div class="meta">最近更新</div>
                    <div class="recent-update">
                        <a :key="`${update.id}-${update.id}`" v-for="update in user.updates" class="new" target="_blank" :href="`/p/${update.id}.html`">{{update.name}}</a>
                    </div>
                </div>
            </div>
        </div>
        <a v-if="loaderVisible" @click="onLoad" class="btn btn-danger load-more-btn">{{loaderText}}</a>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import BigFollow from '~/js/components/user/BigFollow.vue';

export default {
    data () {
        return {
            page: 1,
            users: [],
            loaderVisible: false,
            isLoading: false,
            isLoadFirstPage: true,
        };
    },
    mounted() {
        this.load();
        this.$nextTick(() => {
        });
    },
    computed: {
        loaderText () {
            if (this.isLoading) {
                return '加载中...';
            }
            return '加载更多';
        }
    },
    methods: {
        onLoad () {
            this.load();
        },
        load () {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            myHTTP.get(`/recommendations/users?page=${this.page}`)
                .then((result) => {
                    if (this.isLoadFirstPage) {
                        this.isLoadFirstPage = false;
                        this.loaderVisible = true;
                    }
                    if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        const count = result.data.data.count;
                        const page = result.data.data.page;
                        const pageSize = result.data.data.pageSize;
                        const list = result.data.data.list;
                        this.users = this.users.concat(list);
                        this.page = page + 1;
                        this.isLoading = false;
                        if (page * pageSize >= count) {
                            this.loaderVisible = false;
                        }
                    }
                });
        }
    },
    components: {
        BigFollow,
    }
}
</script>

<style scoped>
</style>

