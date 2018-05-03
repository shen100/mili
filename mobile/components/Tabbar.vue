<template>
    <tabbar>
        <tabbar-item :link="url">
            <x-icon slot="icon" class="tabbar-icon-color" :class="{'tabbar-icon-selectcolor': selected === 'home'}" type="ios-home" size="30"></x-icon>
            <span slot="label">主页</span>
        </tabbar-item>
        <tabbar-item :link="url + '/topic'">
            <x-icon slot="icon" class="tabbar-icon-color" :class="{'tabbar-icon-selectcolor': selected === 'topic'}" type="document-text" size="30"></x-icon>
            <span slot="label">话题</span>
        </tabbar-item>
        <tabbar-item :link="url + '/book'">
            <x-icon slot="icon" class="tabbar-icon-color" :class="{'tabbar-icon-selectcolor': selected === 'book'}" type="ios-book" size="30"></x-icon>
            <span slot="label">图书</span>
        </tabbar-item>
        <tabbar-item :link="url + '/my'">
            <x-icon slot="icon" class="tabbar-icon-color" :class="{'tabbar-icon-selectcolor': selected === 'my'}" type="ios-person" size="30"></x-icon>
            <span slot="label">未登录</span>
        </tabbar-item>
    </tabbar>
</template>

<script>
    import { Tabbar, TabbarItem, Group, Cell } from 'vux'
    import config from '~/config'

    export default {
        data () {
            let path = this.$route.path
            let selected = ''
            switch (path) {
            case '/': {
                selected = 'home'
                break
            }
            case '/topic': {
                selected = 'topic'
                break
            }
            case '/book': {
                selected = 'book'
                break
            }
            case '/my': {
                selected = 'my'
                break
            }
            }
            return {
                selected: selected,
                url: config[process.env.NODE_ENV].url
            }
        },
        components: {
            Tabbar,
            TabbarItem,
            Group,
            Cell
        }
    }
</script>
