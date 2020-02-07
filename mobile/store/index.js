import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        siteConfig: {},
        baiduAdConfig: {},
        user: null,
        isAdminPage: false
    },
    mutations: {
        siteConfig (state, siteConfig) {
            state.siteConfig = siteConfig
        },
        baiduAdConfig (state, baiduAdConfig) {
            state.baiduAdConfig = baiduAdConfig
        },
        isAdminPage (state, isAdminPage) {
            state.isAdminPage = isAdminPage
        },
        user (state, user) {
            state.user = user
        },
        avatarURL (state, url) {
            if (state.user) {
                state.user.avatarURL = url
            }
        }
    }
})

export default store
