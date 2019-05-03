import '~/styles/main.scss';
import '~/styles/recommendations/users.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import Users from '~/js/pages/recommendations/Users.vue';

new Vue({
    render: h => h(Users),
}).$mount('#userList');
