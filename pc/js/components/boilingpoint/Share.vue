<template>
    <div ref="box" class="share-panel shadow" :class="{'share-panel-nobefore': isTop, 'share-panel-noafter': isTop}" :style="style">
        <div :data-clipboard-text="`${url}/boiling/${boilingPointItemID}`" @click="onCopyLink" class="share-item copy-link-btn">
            <div class="share-title-box">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 15 15" class="icon link-icon">
                    <path fill="#007FFF" fill-rule="nonzero" d="M6.561 11.538c.329-.33.892-.33 1.268-.047.328.375.328.939 0 1.267l-1.08 1.08a3.939 3.939 0 0 1-5.587 0 3.939 3.939 0 0 1 0-5.587L3.744 5.67a3.939 3.939 0 0 1 5.587 0c.329.376.329.939 0 1.268-.376.328-.939.328-1.268 0a2.21 2.21 0 0 0-1.549-.658c-.61 0-1.127.235-1.55.658L2.384 9.519a2.21 2.21 0 0 0 0 3.098 2.21 2.21 0 0 0 1.549.658c.61 0 1.127-.235 1.55-.658l1.079-1.08zm7.277-10.376c1.55 1.502 1.55 4.037 0 5.587L11.256 9.33a3.939 3.939 0 0 1-5.587 0l-.047-.047a.868.868 0 0 1 .047-1.174c.376-.328.939-.328 1.268 0a2.21 2.21 0 0 0 1.549.658c.61 0 1.127-.235 1.55-.658l2.581-2.582a2.21 2.21 0 0 0 0-3.099 2.21 2.21 0 0 0-1.549-.657c-.61 0-1.127.235-1.55.657l-1.08 1.08c-.375.329-.938.329-1.267 0-.328-.375-.328-.939 0-1.267l1.08-1.08a3.939 3.939 0 0 1 5.587 0z"></path>
                </svg>
                <span class="share-title">复制链接</span>
            </div>
        </div>
        <a class="share-item weibo" :href="`${shareURL}&platform=weibo`" target="_blank">
            <div class="share-title-box">
                <svg aria-hidden="true" width="20" height="16" viewBox="0 0 20 16" class="icon weibo-icon">
                    <path fill="#E26262" fill-rule="evenodd" d="M14.815 7.697c-.228-.045-.377-.112-.445-.2-.068-.09-.08-.172-.035-.247l.07-.112a.268.268 0 0 0 .045-.067 6.67 6.67 0 0 0 .092-.19c.045-.097.08-.194.103-.29.023-.098.042-.217.057-.359.015-.141.01-.276-.012-.403a1.688 1.688 0 0 0-.137-.413 1.382 1.382 0 0 0-.286-.403c-.214-.21-.492-.343-.835-.403a3.18 3.18 0 0 0-1.028-.012c-.343.053-.667.12-.972.202-.305.082-.556.16-.754.234l-.297.135a2.936 2.936 0 0 1-.377.09.442.442 0 0 1-.23-.012.612.612 0 0 1-.125-.067c-.03-.023-.042-.075-.035-.157.008-.082.015-.153.023-.213s.027-.152.057-.28c.03-.126.053-.227.069-.301 0-.18-.012-.347-.034-.504A2.416 2.416 0 0 0 9.58 3.2a1.128 1.128 0 0 0-.331-.47 1.716 1.716 0 0 0-.549-.29c-.22-.074-.507-.097-.857-.067s-.747.119-1.189.268a7.407 7.407 0 0 0-1.623.794A9.655 9.655 0 0 0 3.602 4.53c-.403.38-.773.749-1.109 1.107-.335.358-.594.648-.777.872l-.252.358C.961 7.509.588 8.15.344 8.792c-.243.64-.358 1.125-.343 1.453v.47c.092.715.317 1.356.675 1.923a4.784 4.784 0 0 0 1.28 1.376c.495.35 1.078.648 1.749.894.67.247 1.314.425 1.932.537.617.112 1.269.19 1.954.235 1.128.09 2.298.004 3.509-.257a10.739 10.739 0 0 0 3.383-1.353c1.044-.642 1.78-1.41 2.206-2.304.26-.522.393-1.014.4-1.477.008-.462-.072-.838-.24-1.129a2.887 2.887 0 0 0-.651-.771 3.248 3.248 0 0 0-.754-.493 2.625 2.625 0 0 0-.629-.2v.001zm-6.971 6.956c-1.646.074-3.044-.24-4.195-.94-1.15-.7-1.725-1.588-1.725-2.661 0-1.06.571-1.972 1.714-2.74 1.143-.768 2.545-1.189 4.206-1.264 1.661-.075 3.063.194 4.206.805 1.143.612 1.715 1.447 1.715 2.505 0 1.074-.583 2.039-1.75 2.896-1.165.858-2.556 1.324-4.17 1.398h-.001zM7.18 8.457a3.857 3.857 0 0 0-1.189.302c-.35.157-.625.336-.823.537a3.422 3.422 0 0 0-.503.648c-.137.231-.233.459-.286.682a4.203 4.203 0 0 0-.103.615 5.242 5.242 0 0 0-.023.436l.023.179v.09c0 .044.015.134.046.268.03.134.073.257.126.369.053.112.14.235.262.37.122.133.267.245.435.335 1.006.477 1.943.622 2.812.436.868-.187 1.57-.615 2.103-1.286a1.98 1.98 0 0 0 .423-.94c.068-.373.052-.75-.047-1.13a2.848 2.848 0 0 0-.514-1.04c-.244-.313-.605-.555-1.085-.726-.48-.171-1.033-.22-1.658-.145zm-.823 4.228a1.071 1.071 0 0 1-.492-.034 2.542 2.542 0 0 1-.205-.078.47.47 0 0 1-.171-.123 2.287 2.287 0 0 1-.126-.157.675.675 0 0 1-.126-.391.94.94 0 0 1 .138-.481c.091-.157.217-.291.377-.403.16-.112.339-.176.537-.19.137-.015.27-.011.4.011a1.014 1.014 0 0 1 .571.29.588.588 0 0 1 .149.235c.03.09.045.186.046.29 0 .165-.05.321-.149.47a1.29 1.29 0 0 1-.948.56h-.001zm1.943-1.61a.513.513 0 0 1-.332.1c-.114-.007-.194-.055-.24-.145l-.046-.09a.198.198 0 0 1-.022-.089v-.09c0-.044.007-.081.022-.111l.046-.09a.145.145 0 0 1 .07-.067l.068-.09a.486.486 0 0 1 .354-.11.288.288 0 0 1 .24.178c.046.06.065.127.057.201a.543.543 0 0 1-.069.213.857.857 0 0 1-.148.19zM16.416 6.4a.486.486 0 0 0 .251-.068.566.566 0 0 0 .275-.38c.015-.014.022-.037.022-.067.183-1.7-.426-2.669-1.828-2.907a3.3 3.3 0 0 0-1.144-.023.474.474 0 0 0-.274.078.711.711 0 0 0-.194.201.458.458 0 0 0-.08.257c0 .15.053.276.16.38a.539.539 0 0 0 .388.157c1.19-.268 1.83.104 1.92 1.119.031.253.016.492-.046.715 0 .15.054.276.16.38a.539.539 0 0 0 .39.157zM16.027.093c-.67-.149-1.57-.12-2.697.09-.015 0-.03.007-.046.022L13.26.25l-.023.022a.744.744 0 0 0-.412.28.747.747 0 0 0-.16.459c0 .224.077.41.23.559a.76.76 0 0 0 .548.224h.069c.015 0 .049-.008.103-.022.053-.015.11-.026.17-.034a1.07 1.07 0 0 0 .195-.045c.07-.023.13-.045.183-.067a.923.923 0 0 1 .309-.034c.153 0 .34.011.56.034.22.022.465.078.732.167.267.09.534.201.8.336.266.134.533.32.8.559.267.238.5.513.697.827.397.88.473 1.73.23 2.55 0 .015-.005.03-.012.045a.709.709 0 0 0-.035.112c-.015.059-.03.115-.046.167a2.01 2.01 0 0 0-.046.201 1.188 1.188 0 0 0-.023.213.5.5 0 0 0 .115.335c.076.09.171.153.286.19.114.038.248.056.4.056.426 0 .678-.253.754-.76a6.498 6.498 0 0 0 .309-1.666 4.978 4.978 0 0 0-.115-1.398 4.434 4.434 0 0 0-.445-1.13 3.797 3.797 0 0 0-.686-.894 5.56 5.56 0 0 0-.87-.671 5.808 5.808 0 0 0-1.851-.772z"></path>
                </svg>
                <span class="share-title">微博</span>
            </div>
        </a>
        <div class="share-item">
            <div class="share-title-box">
                <svg aria-hidden="true" width="20" height="17" viewBox="0 0 20 17" class="icon wechat-icon">
                    <path fill="#83C73A" fill-rule="evenodd" d="M13.49 4.97c.229 0 .455.017.68.042C13.558 2.17 10.52.06 7.052.06 3.176.06 0 2.702 0 6.057c0 1.937 1.057 3.528 2.822 4.762l-.705 2.121 2.465-1.236c.883.175 1.59.354 2.471.354.221 0 .44-.01.658-.028a5.254 5.254 0 0 1-.217-1.478c0-3.081 2.646-5.582 5.996-5.582zM9.698 3.058c.53 0 .883.35.883.88 0 .529-.352.883-.883.883-.529 0-1.06-.354-1.06-.883 0-.53.531-.88 1.06-.88zM4.762 4.821c-.529 0-1.062-.354-1.062-.883 0-.53.533-.88 1.062-.88.528 0 .88.35.88.88 0 .529-.352.883-.88.883zm15.165 5.646c0-2.82-2.821-5.118-5.99-5.118-3.356 0-6 2.299-6 5.118 0 2.825 2.644 5.119 6 5.119.702 0 1.41-.178 2.116-.354l1.934 1.059-.53-1.763c1.415-1.062 2.47-2.47 2.47-4.06zm-7.936-.882c-.35 0-.705-.35-.705-.706 0-.351.354-.705.705-.705.534 0 .883.354.883.705 0 .357-.35.706-.883.706zm3.88 0c-.349 0-.7-.35-.7-.706 0-.351.351-.705.7-.705.529 0 .883.354.883.705 0 .357-.354.706-.883.706z"></path>
                </svg>
                <span class="share-title">微信扫一扫</span>
            </div>
            <div class="qr-code" :style="{'background-image': `url(${qrcodeURL})`}"></div>
        </div>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { isInViewport, } from '~/js/utils/dom.js';
import QRCode from 'qrcode';

export default {
    props: [
        'boilingPointItemID',
        'summary',
        'imgs',
    ],
    data() {
        let imgURL = '';
        if (this.imgs && this.imgs.length) {
            imgURL = this.imgs[0].url;
        }
        const boilingURL = globalConfig.url + `/boiling/${this.boilingPointItemID}`;
        let shareURL = `${window.globalConfig.apiPrefix}/share?content=${encodeURIComponent(this.summary)}`;
        shareURL += `&imgurl=${encodeURIComponent(imgURL)}&url=${encodeURIComponent(boilingURL)}`;
        return {
            shareURL,
            qrcodeURL: '',
            url: globalConfig.url,
            style: {
                top: '100%',
                bottom: 'auto', 
            },
            isTop: false, // 是否显示在父容器上方，默认是显示在下方
        };
    },
    mounted() {
        this.$nextTick(() => {
            new ClipboardJS('.copy-link-btn');
            this.adjustCoordinate();
            this.generateQRCodeURL();
        });
    },
    methods: {
        generateQRCodeURL() {
            const options = {
                width: 106,
                height: 106,
                margin: 0,
            };
            QRCode.toDataURL(`${globalConfig.mURL}/boiling/${this.boilingPointItemID}`, options)
                .then(url => {
                    this.qrcodeURL = url;
                })
                .catch(err => {
                    console.error(err);
                })
        },
        adjustCoordinate() {
            this.style = {
                top: '100%',
                bottom: 'auto', 
            };
            this.$nextTick(() => {
                const dom = this.$refs.box;
                if (!dom) {
                    return;
                }
                if (!isInViewport(dom)) {
                    this.style = {
                        top: 'auto',
                        bottom: '100%',
                    };
                    this.isTop = true;
                }
            });
        },
        onCopyLink() {
            this.$emit('copyLink');
        },
    },
}
</script>

<style lang="scss" scoped>
.share-panel {
    position: absolute;
    top: 100%;
    left: 50%;
    margin: 0 0 0 -67px;
    width: 134px;
    background-color: #fff;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    z-index: 101;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.share-panel:after, .share-panel:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
}

.share-panel:before {
    margin: -7px 0 0 -7px;
    border: 7px solid transparent;
    border-top: none;
    border-bottom: 7px solid #ebebeb;
}

.share-panel:after {
    margin: -6px 0 0 -6px;
    border: 6px solid transparent;
    border-top: none;
    border-bottom: 6px solid #fff;
}

.share-panel-nobefore:before {
    display: none;
}

.share-panel-noafter:after {
    display: none;
}

.share-panel .share-item {
    padding: 6px 10px;
    cursor: pointer;
}

.share-panel .share-item:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
}

.share-panel .share-title-box {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #8a93a0;
}

.share-panel .share-title-box .icon {
    margin-right: 9.6px;
    width: 20px;
}

svg:not(:root) {
    overflow: hidden;
}

.share-panel .qr-code {
    margin: 7px 0 9.6px;
    height: 100px;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: contain;
}

.share-panel .share-item:hover {
    background-color: #fdfdfd;
}

.share-panel .weibo {
    display: block;
}

.share-panel .weibo:hover {
    text-decoration: none;
}

.share-panel .qr-code {
    width: 106px;
    height: 106px;
    margin-right: 0;
    margin-left: 3px;
    margin-bottom: 10px;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: contain;
}
</style>