<template>
    <div class="navbar-user">
        <div id="userDropdownBox" class="user">
            <div data-hover="dropdown">
                <a class="avatar" href="javascript:void(0);">
                    <img :src="avatarURL">
                </a>
            </div>
            <ul class="dropdown-menu" :style="menuStyle[menuAlign]">
                <li><a href="/editor/drafts/new"><i class="fa fa-pencil"></i><span>写文章</span></a></li>
                <li><a href="/handbooks/new"><i class="fa fa-book" aria-hidden="true"></i><span>写小册</span></a></li>
                <li><a href="/editor/drafts"><i class="fa fa-file-text" aria-hidden="true"></i><span>草稿</span></a></li>
                <li class="dropdown-menu-sep"></li>
                <li><a :href="`/uc/${userID}`"><i class="iconfont ic-navigation-profile"></i><span>我的主页</span></a></li>
                <li><a :href="`/uc/${userID}/like/articles`"><i class="fa fa-thumbs-up" aria-hidden="true"></i><span>我赞过的</span></a> </li>
                <li><a :href="`/uc/${userID}/writehandbooks`"><i class="fa fa-sticky-note" aria-hidden="true"></i><span>我的小册</span></a></li>
                <li><a :href="`/uc/${userID}/collections`"><i class="fa fa-star" aria-hidden="true"></i><span>我的收藏集</span></a></li>
                <li><a :href="`/uc/${userID}/buyhandbooks`"><i class="iconfont ic-navigation-wallet"></i><span>已购</span></a></li>
                <li class="dropdown-menu-sep"></li>
                <li><a href="/tags"><i class="fa fa-tags" aria-hidden="true"></i><span>标签管理</span></a></li>
                <li><a href="/settings/profile"><i class="iconfont ic-navigation-settings"></i><span>设置</span></a></li>
                <li class="dropdown-menu-sep"></li>
                <li><a @click="onSignout"><i class="iconfont ic-navigation-signout"></i><span>退出</span></a></li>
            </ul>
            
        </div>
    </div>
</template>


<script>
import {
    addClass,
    removeClass,
    hasClass,
} from '~/js/utils/dom.js';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'menuAlign',
        'userID',
        'avatarURL'
    ],
    data () {
        return {
            menuStyle: {
                left: { left: 0 },
                right: { right: 0 }
            }
        }
    },
    methods: {
        onSignout() {
            myHTTP.delete('/signout').then((result) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    location.reload();
                }
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            const navbarUser = document.getElementsByClassName('navbar-user')[0];

            document.addEventListener('click', (event) => {
                if (navbarUser.contains(event.target)) {
                    return;
                }
                const userDropdownBox = document.getElementById('userDropdownBox');
                removeClass(userDropdownBox, 'open');
            });

            navbarUser.addEventListener('click', () => {
                const userDropdownBox = document.getElementById('userDropdownBox');
                if (hasClass(userDropdownBox, 'open')) {
                    removeClass(userDropdownBox, 'open');
                } else {
                    addClass(userDropdownBox, 'open');
                }
            });
        });
    }
}
</script>

<style>
.navbar-user .avatar {
    width: 40px;
}
</style>
