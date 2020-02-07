import UAParser from 'ua-parser-js'
import storage from '~/utils/storage'
import uuid from '~/utils/uuid'
import request from '~/net/request'

let ua

function init () {
    ua = new UAParser().getResult()

    let lang = navigator.language || navigator.browserLanguage ||
        navigator.systemLanguage ||
        navigator.userLanguage || ''
    let country = ''
    let language = ''
    let index = lang.indexOf('-')
    if (index > 0) {
        country = lang.substr(index + 1).toUpperCase()
        language = lang.substr(0, index)
    }
    ua.country = country
    ua.language = language
    ua.device.screenWidth = window.screen.width
    ua.device.screenHeight = window.screen.height
    ua.device.model = ua.device.model || ''
}

function pv () {
    const LOCAL_DATA = 'analyzeLS'
    const LOCAL_DATA_VERSION = 'v1.0.0'

    var localData = storage.getItem(LOCAL_DATA)
    if (!localData || localData.version < LOCAL_DATA_VERSION) {
        localData = {
            clientId: uuid(),
            version: LOCAL_DATA_VERSION
        }
        storage.setItem(LOCAL_DATA, localData)
    }

    let params = {
        clientId: localData.clientId,
        platform: 'web_pc',
        osName: ua.os.name,
        osVersion: ua.os.version,
        language: ua.language,
        country: ua.country,
        deviceModel: ua.device.model,
        deviceWidth: ua.device.screenWidth,
        deviceHeight: ua.device.screenHeight,
        referrer: encodeURIComponent(document.referrer),
        url: encodeURIComponent(location.href),
        browserName: ua.browser.name,
        browserVersion: ua.browser.version
    }

    request.sendUserVisit({
        query: params
    }).then(res => {
    })
}

init()

export default ({ app: { router }, store }) => {
    router.afterEach((to, from) => {
        if (store.state.isAdminPage) {
            return
        }
        if (typeof window !== 'undefined') {
            pv()
        }
    })
}
