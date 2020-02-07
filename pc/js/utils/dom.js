export const addClass = (obj, className) => {
    if (obj.className !== '') {
        obj.className = obj.className + ' ' + className;
    } else {
        obj.className = className;
    }
};

export const removeClass = (obj, className) => {
    let objClass = ' ' + obj.className + ' ';
    objClass = objClass.replace(/(\s+)/gi, ' ');
    let removed = objClass.replace(' ' + className + ' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;
};

export const hasClass = (obj, className) => {
    let classList = obj.className.split(/\s+/);
    classList = classList || [];
    if (classList.indexOf(className) >= 0) {
        return true;
    }
    return false;
};

export const getWindowSize = (function () {
    let func;
    if (window.innerHeight !== undefined) {
        func = () => {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        };
    } else if (document.compatMode === 'CSS1Compat') {
        func = () => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            };
        };
    } else {
        func = () => {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight,
            };
        };
    }
    return func;
}());

export const getDocumentSize = function () {
    const body = document.body;
    const html = document.documentElement;

    const width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth,
    );
    const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
    );
    return {
        width,
        height,
    };
};

export const isInViewport = function (dom) {
    const winSize = getWindowSize();
    // the size of an element and its position relative to the viewport.
    const clientRect = dom.getBoundingClientRect();
    let inViewport = true;
    if (clientRect.x < 0 || clientRect.y < 0) {
        inViewport = false;
    }
    if (clientRect.y + clientRect.height > winSize.height) {
        inViewport = false;
    }
    if (clientRect.x + clientRect.width > winSize.width) {
        inViewport = false;
    }
    return inViewport;
};

export const getBoundingClientRect = function (dom) {
    // the size of an element and its position relative to the viewport.
    const clientRect = dom.getBoundingClientRect();
    return {
        x: clientRect.x,
        y: clientRect.y,
        width: clientRect.width,
        height: clientRect.height,
    };
};

export const getScrollPos = function () {
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
        scrollLeft,
        scrollTop,
    };
};

export const hasScroller = function () {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
};

export const isContentEmpty = function (content, editorType) {
    if (editorType === 'rich') {
        if (!content || content === '<p></p>') {
            return true;
        }
    } else {
        // markdown
        if (!content) {
            return true;
        }
    }
    return false;
};

export const elementScrollToTop = function(el, dt) {
    el.scrollIntoView();
    if (hasScroller()) {
        let top = document.documentElement.scrollTop - dt;
        document.documentElement.scrollTop = top >= 0 ? top : 0;
    }
}

let isFullscreen = false;

export const toggleFullScreen = () => {
    let element = document.documentElement;
    // 判断是否已经是全屏
    // 如果是全屏，退出
    if (isFullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        console.log('已还原！');
    } else {    // 否则，进入全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
        console.log('已全屏！');
    }
    // 改变当前全屏状态
    isFullscreen = !isFullscreen;
};