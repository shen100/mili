<template>
    <div class="side-menu-wrapper">
        <slot></slot>
        <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
            <template v-for="item in menuList">
                <template v-if="item.children && item.children.length === 1">
                    <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item" />
                    <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><common-icon :type="item.children[0].icon || ''"/><span>{{ showTitle(item.children[0]) }}</span></menu-item>
                </template>
                <template v-else>
                    <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item" />
                    <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
                </template>
            </template>
        </Menu>
        <div class="menu-collapsed" v-show="collapsed" :list="menuList">
            <template v-for="item in menuList">
                <CollapsedMenu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`" />
                <Tooltip transfer v-else :content="showTitle(item.children && item.children[0] ? item.children[0] : item)" placement="right" :key="`drop-menu-${item.name}`">
                    <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/></a>
                </Tooltip>
            </template>
        </div>
    </div>
</template>

<script>
import SideMenuItem from './SideMenuItem.vue'
import CollapsedMenu from './CollapsedMenu.vue'
import { getUnion } from './tools.js';
import mixin from './mixin.js';

export default {
    name: 'SideMenu',
    mixins: [ mixin ],
    components: {
        SideMenuItem,
        CollapsedMenu
    },
    props: {
        menuList: {
            type: Array,
            default () {
                return []
            }
        },
        collapsed: {
            type: Boolean
        },
        theme: {
            type: String,
            default: 'dark'
        },
        rootIconSize: {
            type: Number,
            default: 20
        },
        iconSize: {
            type: Number,
            default: 16
        },
        accordion: Boolean,
        activeName: {
            type: String,
            default: ''
        },
        openNames: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            openedNames: this.openNames && this.openNames || []
        };
    },
    methods: {
        handleSelect (name) {
            this.$emit('on-select', name)
        },
        getOpenedNamesByActiveName (name) {
            return this.$route.matched.map(item => item.name).filter(item => item !== name)
        },
        updateOpenName (name) {
            if (name === this.$config.homeName) {
                this.openedNames = [];
            } else {
                this.openedNames = this.getOpenedNamesByActiveName(name);
            }
        }
    },
    computed: {
        textColor () {
            return this.theme === 'dark' ? '#fff' : '#495060';
        }
    },
    watch: {
        activeName (name) {
            if (this.accordion) {
                this.openedNames = this.getOpenedNamesByActiveName(name);
            } else {
                this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
            }
        },
        openNames (newNames) {
            this.openedNames = newNames;
        },
        openedNames () {
            this.$nextTick(() => {
                this.$refs.menu.updateOpened();
            });
        }
    },
    mounted () {
        this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
    }
}
</script>

<style>
.side-menu-wrapper {
    user-select: none;
}
.side-menu-wrapper .menu-collapsed {
    padding-top: 10px;
}
.side-menu-wrapper .menu-collapsed .ivu-dropdown {
    width: 100%;
}
.side-menu-wrapper .menu-collapsed .ivu-dropdown .ivu-dropdown-rel a {
    width: 100%;
}
.side-menu-wrapper .menu-collapsed .ivu-tooltip {
    width: 100%;
}
.side-menu-wrapper .menu-collapsed .ivu-tooltip .ivu-tooltip-rel {
    width: 100%;
}
.side-menu-wrapper .menu-collapsed .ivu-tooltip .ivu-tooltip-popper .ivu-tooltip-content .ivu-tooltip-arrow {
    border-right-color: #fff;
}
.side-menu-wrapper .menu-collapsed .ivu-tooltip .ivu-tooltip-popper .ivu-tooltip-content .ivu-tooltip-inner {
    background: #fff;
    color: #495060;
}
.side-menu-wrapper a.drop-menu-a {
    display: inline-block;
    padding: 6px 15px;
    width: 100%;
    text-align: center;
    color: #495060;
}
.menu-title {
    padding-left: 6px;
}
</style>
