import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        siteConfig: null,
        messages: [],
        messageCount: 0,
        user: null,
        top10Users: [],
        maxCommentArticles: [],
        maxBrowseArticles: []
    },
    mutations: {
        siteConfig (state, siteConfig) {
            state.siteConfig = siteConfig
        },
        messages (state, messages) {
            state.messages = messages
        },
        messageCount (state, messageCount) {
            state.messageCount = messageCount
        },
        user (state, user) {
            state.user = user
        },
        top10Users (state, top10Users) {
            state.top10Users = top10Users
        },
        maxCommentArticles (state, maxCommentArticles) {
            state.maxCommentArticles = maxCommentArticles
        },
        maxBrowseArticles (state, maxBrowseArticles) {
            state.maxBrowseArticles = maxBrowseArticles
        }
    }
})

export default store
