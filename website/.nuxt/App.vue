<template>
  <div id="__nuxt">
    <nuxt-loading ref="loading"></nuxt-loading>
    <component v-if="layout" :is="nuxt.err ? 'nuxt' : layout"></component>
  </div>
</template>

<script>
import Vue from 'vue'
import NuxtLoading from './components/nuxt-loading.vue'

import '../assets/styles/common.css'


let layouts = {

  "_admin": () => import('../layouts/admin.vue'  /* webpackChunkName: "layouts/admin" */).then(m => m.default || m),

  "_default": () => import('../layouts/default.vue'  /* webpackChunkName: "layouts/default" */).then(m => m.default || m),

  "_signin": () => import('../layouts/signin.vue'  /* webpackChunkName: "layouts/signin" */).then(m => m.default || m)

}

let resolvedLayouts = {}

export default {
  head: {"titleTemplate":"%s - Golang中文社区 - 和地鼠们分享你的知识、经验和见解","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"golang123 - 一个专业的Go语言技术社区，帮助你寻找答案，分享知识。"},{"name":"keywords","content":"golang,go,go语言,golang社区,go社区,golang中国,go中国,golang中文社区,go中文社区,go语言中文网,golang123,社区"}],"link":[{"rel":"icon","type":"image/x-icon","href":"/favicon.ico"},{"rel":"stylesheet","href":"/styles/iview-2.0.0.css"}],"style":[],"script":[]},
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options._nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },
  
  mounted () {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },
  
  methods: {
    
    errorChanged () {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) this.$loading.fail()
        if (this.$loading.finish) this.$loading.finish()
      }
    },
    
    setLayout (layout) {
      if (!layout || !resolvedLayouts['_' + layout]) layout = 'default'
      this.layoutName = layout
      let _layout = '_' + layout
      this.layout = resolvedLayouts[_layout]
      return this.layout
    },
    loadLayout (layout) {
      if (!layout || !(layouts['_' + layout] || resolvedLayouts['_' + layout])) layout = 'default'
      let _layout = '_' + layout
      if (resolvedLayouts[_layout]) {
        return Promise.resolve(resolvedLayouts[_layout])
      }
      return layouts[_layout]()
      .then((Component) => {
        resolvedLayouts[_layout] = Component
        delete layouts[_layout]
        return resolvedLayouts[_layout]
      })
      .catch((e) => {
        if (this.$nuxt) {
          return this.$nuxt.error({ statusCode: 500, message: e.message })
        }
      })
    }
  },
  components: {
    NuxtLoading
  }
}
</script>

