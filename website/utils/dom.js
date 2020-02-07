export const getPageWidth = () => {
    let pageWidth = window.innerWidth
    if (typeof pageWidth !== 'number') {
        if (document.compatMode === 'CSS1Compat') {
            pageWidth = document.documentElement.clientWidth
        } else {
            pageWidth = document.body.clientWidth
        }
    }
    return pageWidth
}

export const getPageHeight = () => {
    let pageHeight = window.innerHeight
    if (typeof pageHeight !== 'number') {
        if (document.compatMode === 'CSS1Compat') {
            pageHeight = document.documentElement.clientHeight
        } else {
            pageHeight = document.body.clientHeight
        }
    }
    return pageHeight
}

export const getScrollTop = () => {
    return document.documentElement.scrollTop || document.body.scrollTop
}
