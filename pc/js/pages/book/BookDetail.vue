<template>
    <div>
        <HandBookComment v-show="currentSelect === 'star'" type="star" :bookID="book.id" @change="onChange" />
        <HandBookComment v-show="currentSelect === 'comment'" type="comment" :bookID="book.id" @change="onChange" />
        <UserList v-if="userListVisible" @close="onUserListClose" type="book" :bookID="book.id"/>
    </div>
</template>

<script>
import HandBookComment from '~/js/components/handbook/HandBookComment.vue';
import UserList from '~/js/components/handbook/UserList.vue';

export default {
    props: ['book'],
    data() {
        return {
            currentSelect: 'star',
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