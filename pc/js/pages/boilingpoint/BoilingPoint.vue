<template>
    <div>
        <SuccessTip ref="successTip" :width="200" />
        <ErrorTip ref="errorTip" />
        <!-- 沸点列表页面 -->
        <template v-if="isBoilingPointList">
            <div v-if="hasEditor" class="the-editor-box">
                <BoilingPointEditor @success="onSuccess" @error="onError" placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见呦~"/>
            </div>
            <Pinterest ref="pinterest" :url="url" :query="{topicID: topicID}" @load="onLoad">
                <template v-slot:loading>
                    <BoilingPointLoading :loadingStyle="loadingStyle"/>
                </template>
                <template v-slot:content>
                    <div>
                        <ul class="boilingpoint-list" :style="{'margin-top': hasEditor ? '8px' : '0'}">
                            <BoilingPointItem :maxMiddleImgWidth="maxMiddleImgWidth" @bigImageChange="onBrowseBigImg" 
                                :key="item.id" v-for="item in boilingPoints" @copyLink="onCopyLink"
                                :userID="userID" :boilingData="item" @userFollowChange="onFollowChange"
                                @report="onReport(item.id)" />
                        </ul>
                    </div>
                </template>
            </Pinterest>
        </template>
        <!-- 沸点详情页面 -->
        <div v-else>
            <ul class="boilingpoint-list" style="margin-top: 0;">
                <BoilingPointItem @bigImageChange="onBrowseBigImg"
                    :key="item.id" v-for="item in boilingPoints" @copyLink="onCopyLink"
                    :userID="userID" :boilingData="item" @userFollowChange="onFollowChange"
                    @report="onReport(item.id)" />
            </ul>
        </div>
        <template v-if="bigImgURL">
            <div class="big-img-box">
                <img class="big-img" :src="bigImgURL" :style="bigImgStyle" />
            </div>
            <div @click="onClose" class="bp-control close">
                <img src="../../../images/boilingpoint/close.svg" />
            </div>
            <div v-if="curBigImgIndex > 0" @click="onPrev" class="bp-control-prev"></div>
            <div v-if="curBigImgIndex < this.bigImgs.length - 1" @click="onNext" class="bp-control-next"></div>
            <div @mouseenter="onEnterCouter" @mouseleave="onLeaveCouter" class="counter-bar-wrapper">
                <div class="counter-bar" :style="{transform: isLeaveCouter ? 'translateY(100%)' : 'translateY(0)'}">
                    <div class="counter-hinter">
                        <span class="current-index">{{curBigImgIndex + 1}}</span>
                        <span>/ {{bigImgs.length}}</span>
                    </div>
                </div>
            </div>
        </template>
        <ReportAlert ref="reportAlert" />
    </div>
</template>

<script>
import SuccessTip from '~/js/components/common/SuccessTip.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import BoilingPointEditor from '~/js/components/editor/BoilingPointEditor.vue';
import BoilingPointLoading from '~/js/components/boilingpoint/BoilingPointLoading.vue';
import BoilingPointItem from '~/js/components/boilingpoint/BoilingPointItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';
import ReportAlert from '~/js/components/boilingpoint/ReportAlert.vue';

import {
    getWindowSize,
} from '~/js/utils/dom.js';

export default {
    props: [
        'url',
        'editorEnable', // 是否创建沸点编辑器
        'topicID', // 有topicID时，那么是话题下的沸点列表
        'userID', // 当前登录用户的id
        'boilingPoint', // boilingPoint 不为空的话，那就是具体的沸点页面，否则是沸点列表
        'loadingStyle',
        'maxMiddleImgWidth'
    ],
    data() {
        return {
            hasEditor: this.editorEnable || typeof this.editorEnable === 'undefined' ? true : false,
            isBoilingPointList: this.boilingPoint ? false : true,
            boilingPoints: this.boilingPoint ? [ this.boilingPoint ] : [],
            bigImgStyle: {},
            bigImgURL: '',
            curBigImgIndex: -1,
            bigImgs: [
            ],
            isLeaveCouter: true, // 鼠标移出大图页码组件
        };
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize.bind(this));
        });
    },
    methods: {
        onCopyLink() {
            this.$refs.successTip.show('链接复制成功');
        },
        onResize() {
            if (this.bigImgs.length && this.bigImgs[this.curBigImgIndex]) {
                this.changeBigImgStyle(this.bigImgs[this.curBigImgIndex]);
            }
        },
        onLoad(result) {
            this.boilingPoints = this.boilingPoints.concat(result.data.data.list);
            if (!result.data.data.count) {
                this.$emit('empty');
            }
        },
        onBrowseBigImg(imgs, index) {
            this.curBigImgIndex = index;
            this.bigImgs = imgs.map(img => {
                return {
                    ...img,
                };
            });
            this.bigImgURL = this.bigImgs[index].url;
            this.changeBigImgStyle(this.bigImgs[index]);
        },
        changeBigImgStyle(curImg) {
            const winSize = getWindowSize();
            let bigImgWidth;
            let bigImgHeight;
            if (curImg.width > winSize.width) {
                bigImgWidth = winSize.width;
                bigImgHeight = curImg.height / (curImg.width / bigImgWidth);
            } else {
                bigImgWidth = curImg.width;
                bigImgHeight = curImg.height;
            }
            if (bigImgHeight > winSize.height) {
                bigImgHeight = winSize.height;
                bigImgWidth = curImg.width / (curImg.height / bigImgHeight);
            }

            this.bigImgStyle = {
                width: bigImgWidth + 'px',
                height: bigImgHeight + 'px',
                left: (winSize.width - bigImgWidth) / 2 + 'px',
                top: (winSize.height - bigImgHeight) / 2 + 'px',
            };
        },
        onEnterCouter() {
            this.isLeaveCouter = false;
        },
        onLeaveCouter() {
            this.isLeaveCouter = true;
        },
        onClose() {
            this.bigImgURL = '';
            this.curBigImgIndex = -1;
            this.bigImgs = [];
            this.bigImgStyle = {};
        },
        onPrev() {
            this.curBigImgIndex--;    
            this.bigImgURL = this.bigImgs[this.curBigImgIndex].url;
            this.changeBigImgStyle(this.bigImgs[this.curBigImgIndex]);
        },
        onNext() {
            this.curBigImgIndex++;    
            this.bigImgURL = this.bigImgs[this.curBigImgIndex].url;
            this.changeBigImgStyle(this.bigImgs[this.curBigImgIndex]);
        },
        onFollowChange(userID, isFollowed) {
        },
        onReport(boilingPointID) {
            this.$refs.reportAlert.show(boilingPointID);
        },
        onSuccess() {
            this.$refs.successTip.show('沸点发布成功');
            this.boilingPoints = [];
            this.$refs.pinterest.refresh();
        },
        onError(message) {
            this.$refs.errorTip.show(message);
        }
    },
    components: {
        SuccessTip,
        ErrorTip,
        BoilingPointEditor,
        Pinterest,
        BoilingPointItem,
        BoilingPointLoading,
        ReportAlert,
    },
}
</script>

<style scoped>
.the-editor-box {
    background: #fff;
    padding: 20px;
    padding-bottom: 6px;
}

.the-editor-box .comment-editor-box {
    margin-top: 0;
}

.boilingpoint-list {
    background: #f4f5f5;
    margin-top: 8px;
}

.big-img-box {
    position: fixed;
    left: 0;
    top: 0;
    background: #222;
    width: 100%;
    height: 100%;
    z-index: 1041;
}

.big-img-box .big-img {
    position: absolute;
}

.bp-control {
    position: absolute;
    cursor: pointer;
    z-index: 1043;
}

.bp-control.close {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: hsla(0, 0%, 41.2%, .2);
    transition: .2s;
    position: fixed;
}

.bp-control.close img {
    position: absolute;
    top: 35%;
    left: 35%;
    width: 30%;
    height: 30%;
}

.bp-control.close.close:hover {
    transform: rotate(-90deg);
    background-color: hsla(0, 0%, 58.8%, .5);
}

.counter-bar-wrapper {
    position: fixed;
    cursor: pointer;
    z-index: 1043;
    left: 0;
    bottom: 0;
}

.counter-bar-wrapper {
    bottom: 0;
    width: 100%;
    height: 66px;
    line-height: 66px;
    text-align: center;
    cursor: default;
}

.counter-bar-wrapper .counter-bar {
    background-color: rgba(0, 0, 0, .6);
    transform: translateY(100%);
    transition: .3s;
}

.counter-bar-wrapper .counter-hinter {
    font-size: 24px;
    font-weight: 600;
    color: hsla(0, 0%, 100%, .6);
}

.counter-bar-wrapper .counter-hinter .current-index {
    margin-right: 8px;
    font-size: 36px;
    color: #fff;
}

.counter-bar-wrapper .counter-hinter {
    font-size: 24px;
    font-weight: 600;
    color: hsla(0, 0%, 100%, .6);
}

.bp-control-prev {
    width: 40%;
    height: 100%;
    position: fixed;
    z-index: 1043;
    left: 0;
    top: 60px;
    cursor: url(../../../images/boilingpoint/left.big.png), auto;
}

.bp-control-next {
    width: 40%;
    height: 100%;
    position: fixed;
    z-index: 1043;
    right: 0;
    top: 60px;
    cursor: url(../../../images/boilingpoint/right.big.png), auto;
}
</style>
