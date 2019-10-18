<template>
    <div>
        <template v-if="book.starUserCount">
            <HandBookComment v-show="currentSelect === 'star'" type="star" @change="onChange"
                :bookID="book.id" :starUserCount="book.starUserCount" :commentCount="book.commentCount" />
        </template>
        <template v-if="book.commentCount">
            <HandBookComment v-show="currentSelect === 'comment'" type="comment" @change="onChange"
                :bookID="book.id" :starUserCount="book.starUserCount" :commentCount="book.commentCount" />
        </template>
        <UserList v-if="userListVisible" @close="onUserListClose" type="book" :bookID="book.id"/>
    </div>
</template>

<script>
import HandBookComment from '~/js/components/handbook/HandBookComment.vue';
import UserList from '~/js/components/handbook/UserList.vue';

export default {
    props: ['book'],
    data() {
        let currentSelect;
        if (book.commentCount) {
            currentSelect = 'comment';
        }
        if (book.starUserCount) {
            currentSelect = 'star';
        }
        return {
            currentSelect: currentSelect,
            userListVisible: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
            const self = this;
            document.getElementById('userStudyOrBuyBtn').addEventListener('click', function() {
                self.userListVisible = true;
            });
        });
    },
    methods: {
        onChange(select) {
            if (select !== this.currentSelect) {
                this.currentSelect = select;
            }
        },
        onUserListClose() {
            this.userListVisible = false;
        }
    },
    components: {
        HandBookComment,
        UserList,
    }
}
</script>