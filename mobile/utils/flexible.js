export default () => {
    if (typeof window === 'undefined') {
        return
    }

    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1

    docEl.setAttribute('data-dpr', dpr)

    function onResize () {
        let fontSize = document.documentElement.clientWidth / 7.5 + 'px'
        document.documentElement.style.fontSize = fontSize
    }
    window.onresize = function () {
        onResize()
    }
    onResize()
}
