import cookie from '~/utils/cookie'

export default {
    getItem: (key) => {
        let local = window.localStorage
        let result = local ? local.getItem(key) : cookie.getCookie(key)
        return result ? JSON.parse(result) : null
    },
    setItem: (key, value) => {
        if (!value) {
            return
        }
        value = JSON.stringify(value)
        let local = window.localStorage
        try {
            local ? local.setItem(key, value) : cookie.setCookie(key, value)
        } catch (e) {

        }
    }
}
