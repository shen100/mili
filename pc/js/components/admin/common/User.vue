<template>
    <div class="user-avatar-dropdown">
        <Dropdown @on-click="handleClick" placement="bottom-end">
            <Avatar :src="avatarURL" />
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="home">
                    <Icon type="ios-home-outline" style="vertical-align: middle;" />
                    <span style="vertical-align: middle;">前往首页</span>
                </DropdownItem>
                <DropdownItem name="logout">
                    <Icon type="ios-exit-outline" style="vertical-align: middle;" />
                    <span style="vertical-align: middle;">退出登录</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data() {
        return {
            avatarURL: window.user.avatarURL
        };
    },
    methods: {
        handleClick(type) {
            switch(type) {
                case 'home': {
                    location.href = '/';
                    break;
                }
                case 'logout': {
                    myHTTP.delete('/users/signout').then((res) => {
                        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                            location.reload();
                        }
                    });
                    break;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.user-avatar-dropdown {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
}

.user-avatar-dropdown .ivu-badge-dot {
    top: 16px;
}
</style>