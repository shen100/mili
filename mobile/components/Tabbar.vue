<template>
    <tabbar>
        <tabbar-item link="/">
            <x-icon slot="icon" class="tabbar-icon-selectcolor" type="ios-home" size="30"></x-icon>
            <span slot="label">主页</span>
        </tabbar-item>
        <tabbar-item link="/topic">
            <x-icon slot="icon" class="tabbar-icon-color" type="document-text" size="30"></x-icon>
            <span slot="label">话题</span>
        </tabbar-item>
        <tabbar-item link="/book">
            <x-icon slot="icon" class="tabbar-icon-color" type="ios-book" size="30"></x-icon>
            <span slot="label">图书</span>
        </tabbar-item>
        <tabbar-item link="/my">
            <x-icon slot="icon" class="tabbar-icon-color" type="ios-person" size="30"></x-icon>
            <span slot="label">未登录</span>
        </tabbar-item>
    </tabbar>
</template>

<script>
    import { Tabbar, TabbarItem, Group, Cell } from 'vux'

    export default {
        components: {
            Tabbar,
            TabbarItem,
            Group,
            Cell
        }
    }
</script>
