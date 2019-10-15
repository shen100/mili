<template>
    <div>
        <HandBookComment v-show="currentSelect === 'star'" select="star" @change="onChange" />
        <HandBookComment v-show="currentSelect === 'comment'" select="comment" @change="onChange" />
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