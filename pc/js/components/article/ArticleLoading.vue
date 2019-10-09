<template>
    <div class="article-placeholder index">
        <div class="img"></div>
        <div class="content">
            <div class="title"></div>
            <div class="text"></div>
            <div class="text animation-delay"></div>
            <div class="meta">
                <div class="read"></div><i class="iconfont ic-list-comments"></i>
                <div class="small"></div>
                <div class="zan">
                    <svg width="12" viewBox="0 0 1084 1024">
                        <path fill="#eaeaea" d="M728.064 343.943529c-17.648941-2.891294-23.552-20.239059-26.503529-28.912941V104.026353C701.560471 46.200471 654.396235 0 595.425882 0c-53.007059 0-97.28 40.478118-106.134588 89.569882-29.997176 184.862118-138.541176 255.457882-217.630118 280.937412a26.142118 26.142118 0 0 0-18.130823 24.877177v560.067764c0 19.817412 16.022588 35.84 35.84 35.84h535.973647c56.018824-11.565176 94.328471-31.804235 120.892235-86.738823l120.832-416.105412c23.552-75.173647-14.757647-147.395765-100.231529-144.564706h-238.772706z m-571.813647 31.744H76.619294C35.358118 375.687529 0 410.383059 0 450.861176v462.426353c0 43.369412 32.406588 78.004706 76.619294 78.004706h79.631059c27.708235 0 50.115765-22.407529 50.115765-50.115764V425.863529a50.115765 50.115765 0 0 0-50.115765-50.115764z"></path>
                    </svg>
                </div>
                <div class="small"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.article-placeholder .meta {
    font-size: 0;
}

.article-placeholder .ic-list-comments {
    font-size: 12px;
}

.article-placeholder .meta .zan {
    display: inline-block;
    vertical-align: middle;
    background-color: #fff;
    margin: 0 5px;
}
</style>
