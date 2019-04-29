<template>
    <div class="search-view" style="background: #fff;">
        <Pinterest url="/search" :query="{ q: keyword, type: 'user' }" @load="onLoad">
            <template v-slot:loading>
                <UserLoading />
            </template>
            <template v-slot:content>
                <div>
                    <div class="searchcategory-list">
                        <UserItem :key="user.id" :keyword="keyword" v-for="user in users" :user="user" />
                    </div>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import UserLoading from '~/js/components/user/UserLoading.vue';
import UserItem from '~/js/components/user/UserItem.vue';

export default {
    data () {
        return {
            keyword: window.searchKeyword,
            encodedKeyword: encodeURIComponent(window.searchKeyword),
            users: []
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.users = this.users.concat(result.data.data.list);
        }
    },
    components: {
        Pinterest,
        UserItem,
        UserLoading,
    }
}
</script>

<style scoped>
.searchcategory-list {
    background-color: #fff;
}
</style>

