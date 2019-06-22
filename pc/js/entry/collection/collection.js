import '~/styles/main.scss';
import '~/styles/collection/collection.css';
import Vue from 'vue';
import {
    Modal,
} from 'iview';
import '~/js/common/default.js';
import {
    myHTTP,
} from '~/js/common/net.js';
import {
    ErrorCode,
} from '~/js/constants/error.js';

Vue.component('Modal', Modal);

import App from '~/js/components/collection/collection.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');

const followedBtn = $('#followed-' + window.collectionID);
followedBtn.click(function() {
    const url = `/collections/${window.collectionID}/follow`;
    myHTTP.delete(url).then((res) => {
        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
            if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                followBtn.show();
                followedBtn.hide();
            }
        }
    });
});

const followBtn = $('#follow-' + window.collectionID);
followBtn.click(function() {
    const url = `/collections/${window.collectionID}/follow`;
    myHTTP.post(url).then((res) => {
        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
            followBtn.hide();
            followedBtn.show();
        }
    });
});