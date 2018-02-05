import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _babf75b0 = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _a5cffcf2 = () => import('../pages/vote/index.vue' /* webpackChunkName: "pages/vote/index" */).then(m => m.default || m)
const _c1682030 = () => import('../pages/admin/index.vue' /* webpackChunkName: "pages/admin/index" */).then(m => m.default || m)
const _33af311e = () => import('../pages/timeline/index.vue' /* webpackChunkName: "pages/timeline/index" */).then(m => m.default || m)
const _69a8d049 = () => import('../pages/rank/index.vue' /* webpackChunkName: "pages/rank/index" */).then(m => m.default || m)
const _690f0cb2 = () => import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */).then(m => m.default || m)
const _fa2f2b3a = () => import('../pages/about.vue' /* webpackChunkName: "pages/about" */).then(m => m.default || m)
const _5478b63c = () => import('../pages/signin.vue' /* webpackChunkName: "pages/signin" */).then(m => m.default || m)
const _72fca08f = () => import('../pages/links.vue' /* webpackChunkName: "pages/links" */).then(m => m.default || m)
const _38b10234 = () => import('../pages/admin/setting.vue' /* webpackChunkName: "pages/admin/setting" */).then(m => m.default || m)
const _232b888e = () => import('../pages/admin/pushLink.vue' /* webpackChunkName: "pages/admin/pushLink" */).then(m => m.default || m)
const _1f015ab5 = () => import('../pages/ac/pwdReset.vue' /* webpackChunkName: "pages/ac/pwdReset" */).then(m => m.default || m)
const _1d9c7a17 = () => import('../pages/vote/create.vue' /* webpackChunkName: "pages/vote/create" */).then(m => m.default || m)
const _323a1c3a = () => import('../pages/verify/mail.vue' /* webpackChunkName: "pages/verify/mail" */).then(m => m.default || m)
const _5d1ea1f6 = () => import('../pages/topic/create.vue' /* webpackChunkName: "pages/topic/create" */).then(m => m.default || m)
const _c3da2690 = () => import('../pages/book/create.vue' /* webpackChunkName: "pages/book/create" */).then(m => m.default || m)
const _6feabdc4 = () => import('../pages/ac/pwdModify.vue' /* webpackChunkName: "pages/ac/pwdModify" */).then(m => m.default || m)
const _9efbadb8 = () => import('../pages/user/edit.vue' /* webpackChunkName: "pages/user/edit" */).then(m => m.default || m)
const _92db6710 = () => import('../pages/admin/user/list.vue' /* webpackChunkName: "pages/admin/user/list" */).then(m => m.default || m)
const _4ce745a5 = () => import('../pages/admin/crawl/huxiu.vue' /* webpackChunkName: "pages/admin/crawl/huxiu" */).then(m => m.default || m)
const _4ff3b5a5 = () => import('../pages/admin/category/list.vue' /* webpackChunkName: "pages/admin/category/list" */).then(m => m.default || m)
const _98606a06 = () => import('../pages/admin/reply/list.vue' /* webpackChunkName: "pages/admin/reply/list" */).then(m => m.default || m)
const _0babce58 = () => import('../pages/admin/topic/list.vue' /* webpackChunkName: "pages/admin/topic/list" */).then(m => m.default || m)
const _23658bdb = () => import('../pages/admin/crawl/account.vue' /* webpackChunkName: "pages/admin/crawl/account" */).then(m => m.default || m)
const _14c2fdc2 = () => import('../pages/admin/crawl/jianshu.vue' /* webpackChunkName: "pages/admin/crawl/jianshu" */).then(m => m.default || m)
const _118f2d52 = () => import('../pages/admin/user/today.vue' /* webpackChunkName: "pages/admin/user/today" */).then(m => m.default || m)
const _7115bfd0 = () => import('../pages/admin/user/yesterday.vue' /* webpackChunkName: "pages/admin/user/yesterday" */).then(m => m.default || m)
const _5961ca38 = () => import('../pages/admin/topic/yesterday.vue' /* webpackChunkName: "pages/admin/topic/yesterday" */).then(m => m.default || m)
const _6deaecb3 = () => import('../pages/admin/reply/yesterday.vue' /* webpackChunkName: "pages/admin/reply/yesterday" */).then(m => m.default || m)
const _58157af6 = () => import('../pages/admin/crawl/zhihu.vue' /* webpackChunkName: "pages/admin/crawl/zhihu" */).then(m => m.default || m)
const _7baa359a = () => import('../pages/admin/crawl/custom.vue' /* webpackChunkName: "pages/admin/crawl/custom" */).then(m => m.default || m)
const _bcaa891c = () => import('../pages/admin/reply/today.vue' /* webpackChunkName: "pages/admin/reply/today" */).then(m => m.default || m)
const _454f2377 = () => import('../pages/admin/topic/today.vue' /* webpackChunkName: "pages/admin/topic/today" */).then(m => m.default || m)
const _0bfba810 = () => import('../pages/vote/edit/_id.vue' /* webpackChunkName: "pages/vote/edit/_id" */).then(m => m.default || m)
const _0c0497ab = () => import('../pages/user/collect/_id.vue' /* webpackChunkName: "pages/user/collect/_id" */).then(m => m.default || m)
const _7393542f = () => import('../pages/topic/edit/_id.vue' /* webpackChunkName: "pages/topic/edit/_id" */).then(m => m.default || m)
const _c50493a0 = () => import('../pages/topic/_id.vue' /* webpackChunkName: "pages/topic/_id" */).then(m => m.default || m)
const _2303e190 = () => import('../pages/user/_id.vue' /* webpackChunkName: "pages/user/_id" */).then(m => m.default || m)
const _77b607da = () => import('../pages/user/_id/index.vue' /* webpackChunkName: "pages/user/_id/index" */).then(m => m.default || m)
const _b5cf648e = () => import('../pages/user/_id/vote.vue' /* webpackChunkName: "pages/user/_id/vote" */).then(m => m.default || m)
const _a7a4fbaa = () => import('../pages/user/_id/collect.vue' /* webpackChunkName: "pages/user/_id/collect" */).then(m => m.default || m)
const _4b25cbaa = () => import('../pages/user/_id/reply.vue' /* webpackChunkName: "pages/user/_id/reply" */).then(m => m.default || m)
const _c0128ca2 = () => import('../pages/vote/_id.vue' /* webpackChunkName: "pages/vote/_id" */).then(m => m.default || m)
const _6839ead8 = () => import('../pages/active/_id/_key.vue' /* webpackChunkName: "pages/active/_id/_key" */).then(m => m.default || m)
const _1c25f9f8 = () => import('../pages/ac/_id/_key.vue' /* webpackChunkName: "pages/ac/_id/_key" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _babf75b0,
			name: "index"
		},
		{
			path: "/vote",
			component: _a5cffcf2,
			name: "vote"
		},
		{
			path: "/admin",
			component: _c1682030,
			name: "admin"
		},
		{
			path: "/timeline",
			component: _33af311e,
			name: "timeline"
		},
		{
			path: "/rank",
			component: _69a8d049,
			name: "rank"
		},
		{
			path: "/signup",
			component: _690f0cb2,
			name: "signup"
		},
		{
			path: "/about",
			component: _fa2f2b3a,
			name: "about"
		},
		{
			path: "/signin",
			component: _5478b63c,
			name: "signin"
		},
		{
			path: "/links",
			component: _72fca08f,
			name: "links"
		},
		{
			path: "/admin/setting",
			component: _38b10234,
			name: "admin-setting"
		},
		{
			path: "/admin/pushLink",
			component: _232b888e,
			name: "admin-pushLink"
		},
		{
			path: "/ac/pwdReset",
			component: _1f015ab5,
			name: "ac-pwdReset"
		},
		{
			path: "/vote/create",
			component: _1d9c7a17,
			name: "vote-create"
		},
		{
			path: "/verify/mail",
			component: _323a1c3a,
			name: "verify-mail"
		},
		{
			path: "/topic/create",
			component: _5d1ea1f6,
			name: "topic-create"
		},
		{
			path: "/book/create",
			component: _c3da2690,
			name: "book-create"
		},
		{
			path: "/ac/pwdModify",
			component: _6feabdc4,
			name: "ac-pwdModify"
		},
		{
			path: "/user/edit",
			component: _9efbadb8,
			name: "user-edit"
		},
		{
			path: "/admin/user/list",
			component: _92db6710,
			name: "admin-user-list"
		},
		{
			path: "/admin/crawl/huxiu",
			component: _4ce745a5,
			name: "admin-crawl-huxiu"
		},
		{
			path: "/admin/category/list",
			component: _4ff3b5a5,
			name: "admin-category-list"
		},
		{
			path: "/admin/reply/list",
			component: _98606a06,
			name: "admin-reply-list"
		},
		{
			path: "/admin/topic/list",
			component: _0babce58,
			name: "admin-topic-list"
		},
		{
			path: "/admin/crawl/account",
			component: _23658bdb,
			name: "admin-crawl-account"
		},
		{
			path: "/admin/crawl/jianshu",
			component: _14c2fdc2,
			name: "admin-crawl-jianshu"
		},
		{
			path: "/admin/user/today",
			component: _118f2d52,
			name: "admin-user-today"
		},
		{
			path: "/admin/user/yesterday",
			component: _7115bfd0,
			name: "admin-user-yesterday"
		},
		{
			path: "/admin/topic/yesterday",
			component: _5961ca38,
			name: "admin-topic-yesterday"
		},
		{
			path: "/admin/reply/yesterday",
			component: _6deaecb3,
			name: "admin-reply-yesterday"
		},
		{
			path: "/admin/crawl/zhihu",
			component: _58157af6,
			name: "admin-crawl-zhihu"
		},
		{
			path: "/admin/crawl/custom",
			component: _7baa359a,
			name: "admin-crawl-custom"
		},
		{
			path: "/admin/reply/today",
			component: _bcaa891c,
			name: "admin-reply-today"
		},
		{
			path: "/admin/topic/today",
			component: _454f2377,
			name: "admin-topic-today"
		},
		{
			path: "/vote/edit/:id?",
			component: _0bfba810,
			name: "vote-edit-id"
		},
		{
			path: "/user/collect/:id?",
			component: _0c0497ab,
			name: "user-collect-id"
		},
		{
			path: "/topic/edit/:id?",
			component: _7393542f,
			name: "topic-edit-id"
		},
		{
			path: "/topic/:id?",
			component: _c50493a0,
			name: "topic-id"
		},
		{
			path: "/user/:id?",
			component: _2303e190,
			children: [
				{
					path: "",
					component: _77b607da,
					name: "user-id"
				},
				{
					path: "vote",
					component: _b5cf648e,
					name: "user-id-vote"
				},
				{
					path: "collect",
					component: _a7a4fbaa,
					name: "user-id-collect"
				},
				{
					path: "reply",
					component: _4b25cbaa,
					name: "user-id-reply"
				}
			]
		},
		{
			path: "/vote/:id",
			component: _c0128ca2,
			name: "vote-id"
		},
		{
			path: "/active/:id?/:key?",
			component: _6839ead8,
			name: "active-id-key"
		},
		{
			path: "/ac/:id?/:key?",
			component: _1c25f9f8,
			name: "ac-id-key"
		}
    ],
    fallback: false
  })
}
