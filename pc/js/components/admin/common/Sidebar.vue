<template>
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu accordion ref="sideMenu" :active-name="activeName" :open-names="openNames" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
            <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
            <a href="" class="admin-logo">
                <template v-if="!collapsed">
                    <div class="admin-logo-box">
                        <img src="../../../../images/logo.png"/>
                        <span class="logo-name">米粒</span>
                    </div>
                </template>
                <template v-else>
                    <div class="admin-logo-box collapsed-img">
                        <img src="../../../../images/logo.png"/>
                    </div>
                </template>
            </a>
        </side-menu>
    </Sider>
</template>

<script>
import SideMenu from '~/js/components/common/sidemenu';

const adminPageURL = window.adminPageURL;

export default {
    data () {
        const menuList = [
            {
                name: 'article',
                icon: 'md-document',
                meta: {
                    title: '文章管理'
                },
                children: [
                    {
                        name: `/article/category`,
                        icon: 'md-folder',
                        meta: {
                            title: '分类'
                        },
                    },
                    {
                        name: `/article/list`,
                        icon: 'md-document',
                        meta: {
                            title: '文章'
                        },
                    },
                    {
                        name: `/article/tag`,
                        icon: 'md-pricetag',
                        meta: {
                            title: "标签"
                        },
                    },
                    {
                        name: `/article/crawler/list`,
                        icon: 'md-bug',
                        meta: {
                            title: '爬虫'
                        },
                    },
                    {
                        name: `/article/crawler`,
                        visible: false,
                        activeName: `/article/crawler/list`,
                        icon: 'md-bug',
                        meta: {
                            title: '爬虫'
                        },
                    },
                ],
            },
            {
                name: 'boilingpoint',
                icon: 'md-radio-button-on',
                meta: {
                    title: '沸点管理'
                },
                children: [
                    {
                        name: `/boilingpoint/list`,
                        icon: 'ios-ionic',
                        meta: {
                            title: '沸点'
                        },
                    },
                    {
                        name: `/boilingpoint/topic`,
                        icon: 'ios-chatboxes',
                        meta: {
                            title: '话题'

                        },
                    }
                ]
            },
            {
                name: 'book',
                icon: 'ios-book',
                meta: {
                    title: '图书管理'
                },
                children: [
                    {
                        name: `/book/category`,
                        icon: 'ios-folder-open',
                        meta: {
                            title: '开源图书分类'
                        },
                    },
                    {
                        name: `/handbook/category`,
                        icon: 'md-folder',
                        meta: {
                            title: '小册分类'
                        },
                    },
                    {
                        name: `/book/list`,
                        icon: 'ios-book',
                        meta: {
                            title: '开源图书'
                        },
                    },
                    {
                        name: `/book/:id/edit`,
                        activeName: `/book/list`,
                        visible: false,
                        icon: 'ios-book', // 编辑页，隐藏sidebar中的菜单项，icon随意给个值
                        meta: {},
                    },
                    {
                        name: `/handbook/list`,
                        icon: 'md-bookmarks',
                        meta: {
                            title: '小册'
                        },
                    }
                ]
            },
            {
                name: 'exercise',
                icon: 'ios-paper',
                meta: {
                    title: '练习'
                },
                children: [
                    {
                        name: `/exercise/question/list`,
                        icon: 'ios-paper',
                        meta: {
                            title: '习题',
                        },
                    },
                    {
                        name: `/exercise/question/:id/edit`,
                        visible: false,
                        activeName: `/exercise/question/list`,
                        icon: 'ios-paper',
                        meta: {
                            title: '习题',
                        },
                    },
                    {
                        name: `/exercise/question/new`,
                        visible: false,
                        activeName: `/exercise/question/list`,
                        icon: 'ios-paper',
                        meta: {
                            title: '习题',
                        },
                    },
                ]
            }
        ];
        menuList.forEach(menu => {
            menu.children.forEach(item => {
                item.name = adminPageURL + item.name;
                if (item.activeName) {
                    item.activeName = adminPageURL + item.activeName;
                }
            });
        });
        return {
            isCollapsed: false,
            collapsed: false,
            openNames: [],
            activeName: '',
            menuList,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$router.afterEach((to, from) => {
                this.activeName = to.path;
                this.menuList.forEach(menu => {
                    menu.children.forEach(menuItem => {
                        const name = to.path.replace(/[0-9]+/, ':id');
                        if (menuItem.name === name) {
                            this.openNames = [ menu.name ];
                            if (menuItem.activeName) {
                                this.activeName = menuItem.activeName;
                            }
                        }
                    });
                });
            });
        });
    },
    methods: {
        toggleCollapse() {
            this.collapsed = !this.collapsed;
        },
        turnToPage (name) {
            this.$router.push({
                path: name,
            })
        },
    },
    components: {
        SideMenu,
    }
}
</script>
