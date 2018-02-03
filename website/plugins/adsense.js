import config from '~/config'

/*
 * 引入AdSense
 */
export default ({ app: { router }, store }) => {
    router.afterEach((to, from) => {
        if (config.adsenseID && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
            let adsenseID = config.adsenseID
            let s = document.createElement('script')
            s.async = true
            s.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            let adsenseHTML = `(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: '${adsenseID}',enable_page_level_ads: true});`
            let s2 = document.createElement('script')
            s2.innerHTML = adsenseHTML
            let head = document.getElementsByTagName('head')
            if (head && head[0]) {
                head[0].appendChild(s)
                head[0].appendChild(s2)
            }
        }
    })
}
