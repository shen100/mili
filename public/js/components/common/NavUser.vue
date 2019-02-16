<template>
    <div class="navbar-user">
        <div class="user">
            <div data-hover="dropdown">
                <a class="avatar" :href="`/u/${userID}.html`"><img :src="avatarURL"></a>
            </div>
            <ul class="dropdown-menu" :style="menuStyle[menuAlign]">
                <li><a :href="`/u/${userID}.html`"><i class="iconfont ic-navigation-profile"></i><span>我的主页</span></a></li>
                <li><a href="/bookmarks"><i class="iconfont ic-navigation-mark"></i><span>收藏的文章</span></a> </li>
                <li><a href="/"><i class="iconfont ic-navigation-like"></i><span>喜欢的文章</span></a> </li>
                <li><a href="/my/paid_notes"><i class="iconfont ic-paid"></i><span>已购内容</span></a> </li>
                <li><a href="/wallet"><i class="iconfont ic-navigation-wallet"></i><span>我的钱包</span></a> </li>
                <li><a href="/settings"><i class="iconfont ic-navigation-settings"></i><span>设置</span></a> </li>
                <li><a href="/faqs"><i class="iconfont ic-navigation-feedback"></i><span>帮助与反馈</span></a> </li>
                <li><a rel="nofollow" data-method="delete" href="/sign_out"><i class="iconfont ic-navigation-signout"></i><span>退出</span></a> </li>
            </ul>
        </div>
    </div>
</template>


<script>
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
    },
    mounted() {
        this.$nextTick(() => {
            $('.navbar-user').mouseenter(function() {
                $('.navbar-user .user').addClass('open');
            });

            $('.navbar-user').mouseleave(function() {
                $('.navbar-user .user').removeClass('open');
            });
        });
    }
}
</script>