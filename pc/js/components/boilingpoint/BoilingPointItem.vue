<template>
    <li class="boilingpoint-item">
        <div class="boilingpoint-item-pin">
            <div class="pin-header-row">
                <div class="account-group">
                    <div class="user-popover-box" @mouseenter="onMouseEnterUser1" @mouseleave="onMouseLeaveUser1">
                        <a :href="`/users/${boilingData.user.id}`" target="_blank" class="user-link">
                            <div class="lazy avatar loaded" :style="{'background-image': `url(${boilingData.user.avatarURL})`}"></div>
                        </a>
                        <UserBusinessCard v-if="userCardVisible1" :userID="boilingData.user.id" 
                            :followerID="userID" @userFollowChange="onFollowChange" />
                    </div>
                    <div class="pin-header-content">
                        <div class="user-popover-box" @mouseenter="onMouseEnterUser2" @mouseleave="onMouseLeaveUser2">
                            <a :href="`/users/${boilingData.user.id}`" target="_blank" class="username">{{boilingData.user.username}}</a>
                            <UserBusinessCard v-if="userCardVisible2" :userID="boilingData.user.id" 
                                :followerID="userID" @userFollowChange="onFollowChange" />
                        </div>
                        <div class="meta-box">
                            <template v-if="boilingData.user.job || boilingData.user.company">
                                <div class="position ellipsis">{{boilingData.user | jobCompany}}</div>
                                <div class="dot">·</div>
                            </template>
                            <a :href="`/boiling/${boilingData.id}`" target="_blank" class="time-box">
                                <time class="time">{{boilingData.createdAtLabel}}</time>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="header-action">
                    <FollowBtn v-if="userID !== boilingData.user.id" @userFollowChange="onFollowChange"
                        :userID="boilingData.user.id" :followed="isFollowed" 
                        :followedStyle="followedStyle" :notFollowedStyle="notFollowedStyle" />
                    <div v-clickoutside="clickoutsideReport" class="pin-header-more header-menu">
                        <div @click="onReport" class="more-button">
                            <More />
                        </div>
                        <transition name="custom-classes-transition"
                                enter-active-class="animated fadeIn faster"
                                leave-active-class="animated fadeOut faster">
                            <div v-if="reportVisible" class="dropdown1">
                                <div class="dropdown-caret"></div>
                                <ul class="dropdown-menu1">
                                    <li @click="onShowReportAlert">举报</li>
                                </ul>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="pin-content-row">
                <div v-if="isContentExpand || !partialContent" class="content-box" v-html="boilingData.htmlContent"></div>
                <div v-else class="content-box" v-html="partialContent"></div>
                <div v-if="partialContent" class="content-limit-box">
                    <div @click="changeContentExpand" class="content-limit-btn">{{!isContentExpand ? '展开' : '收起'}}</div>
                </div>
            </div>
            <div class="pin-image-row">
                <div class="image-box-wrapper image-box">
                    <div v-show="gridVisible" class="image-box" :style="{width: gridTotalWidth + 'px'}">
                        <div @click="onClickImgGrid(i)" :key="imgData.id" v-for="(imgData, i) in imgArr" class="image" :class="{'no-right-margin': (i + 1) % 3 === 0}"
                            :style="{'background-image': `url(${imgData.url})`, width: imgData.imgWidth + 'px', height: imgData.imgHeight + 'px'}">
                            <div class="ratio-holder"></div>
                        </div>
                    </div>
                    <div v-if="middleImgCreated" :style="{width: '100%', display: middleImgVisible ? 'block' : 'none'}">
                        <div class="action-bar">
                            <div @click="onExitMiddleImage" class="action-item"
                                @mouseenter="() => pinchIconOver = true" @mouseleave="() => pinchIconOver = false">
                                <span class="icon">
                                    <img v-if="pinchIconOver" src="../../../images/boilingpoint/pinchover.svg" />
                                    <img v-else src="../../../images/boilingpoint/pinch.svg" />
                                </span>
                                <span class="action-name">收起</span>
                            </div>
                            <div @click="onBrowseBigImage" class="action-item"
                                @mouseenter="() => expendIconOver = true" @mouseleave="() => expendIconOver = false">
                                <span class="icon">
                                    <img v-if="expendIconOver" src="../../../images/boilingpoint/expandover.svg" />
                                    <img v-else src="../../../images/boilingpoint/expand.svg" />
                                </span>
                                <span class="action-name">查看大图</span>
                            </div>
                            <div @click="changeMiddleImgTransform(-1)" class="action-item" 
                                @mouseenter="() => leftRotateIconOver = true" @mouseleave="() => leftRotateIconOver = false">
                                <span class="icon">
                                    <img v-if="leftRotateIconOver" src="../../../images/boilingpoint/leftrotateover.svg" />
                                    <img v-else src="../../../images/boilingpoint/leftrotate.svg" />
                                </span>
                                <span class="action-name">向左旋转</span>
                            </div>
                            <div @click="changeMiddleImgTransform(1)" class="action-item" 
                                @mouseenter="() => rightRotateIconOver = true" @mouseleave="() => rightRotateIconOver = false">
                                <span class="icon">
                                    <img v-if="rightRotateIconOver" src="../../../images/boilingpoint/rightrotateover.svg" />  
                                    <img v-else src="../../../images/boilingpoint/rightrotate.svg" />  
                                </span>
                                <span class="action-name">向右旋转</span>
                            </div>
                        </div>
                        <div v-if="curMiddleImg" class="carousel-body" :style="{height: curMiddleImg.style.displayHeight}">
                            <img :key="middleImg.id" v-for="(middleImg, i) in middleImgArr" :src="middleImg.url" 
                                class="carousel-image animated myfadeIn fast" :class="{'hide-middle-img': i !== curImgIndex}"
                                :style="middleImg.style"/>
                            <div v-show="curImgIndex > 0" @click="prevMiddleImg" class="toggle-area prev"></div>
                            <div @click="onExitMiddleImage" class="toggle-area zoomout"></div>
                            <div v-show="curImgIndex < middleImgArr.length - 1" @click="nextMiddleImg" class="toggle-area next"></div>
                        </div>
                        <div class="nav-list">
                            <div @click="changeMiddleImg(i)" :key="imgData.id" v-for="(imgData, i) in imgArr" class="nav-item">
                                <div class="thumb" :class="{active: i === curImgIndex}" :style="{'background-image': `url(${imgData.url})`}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="boilingData.topic" class="pin-topic-row">
                <a :href="`/boilings/topic/${boilingData.topicID}`" target="_blank" :title="boilingData.topic.name" class="topic-title">{{boilingData.topic.name}}</a>
            </div>
            <div class="pin-action-row">
                <div class="action-box action-box">
                    <div class="like-action action">
                        <div @click="onLikeOrNot(boilingData)" class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon like-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <template v-if="!boilingData.userLiked">
                                        <path d="M0 0h20v20H0z"></path>
                                        <path stroke="#8A93A0" stroke-linejoin="round" d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"></path>
                                    </template>
                                    <template v-else>
                                        <path d="M0 0h20v20H0z"></path>
                                        <path stroke="#37C700" stroke-linejoin="round" d="M5.344 8.833V17H4.072C3.482 17 3 16.424 3 15.716V10.22c0-.739.502-1.387 1.072-1.387h1.272zM10.6 4.166c.106-.693.692-1.179 1.335-1.166.918.018 1.465.777 1.655 1.153.346.686.356 1.816.118 2.542-.215.657-.713 1.52-.713 1.52h3.732c.395 0 .762.193 1.006.526.248.341.33.784.218 1.187l-1.69 6.08c-.153.584-.662.992-1.236.992H7.219V8.504c1.686-.361 3.191-3.086 3.381-4.338z" fill="#37C700" stroke-width=".964"></path>
                                    </template>    
                                </g>
                            </svg>
                            <span class="action-title" :style="{color: boilingData.userLiked ? '#37c700' : '#8a93a0'}">{{boilingData.likedCount ? boilingData.likedCount : '赞'}}</span>
                        </div>
                    </div>
                    <div class="comment-action action">
                        <div class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon comment-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z"></path>
                                    <path stroke="#8A93A0" stroke-linejoin="round" d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"></path>
                                </g>
                            </svg>
                            <span class="action-title">{{boilingData.commentCount}}</span>
                        </div>
                    </div>
                    <div class="share-action action">
                        <div @click="changeShareVisible" v-clickoutside="clickoutsideShare" class="action-title-box">
                            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" class="icon share-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z"></path>
                                    <g stroke="#8A93A0" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10 2.5v10M13.5 7h2.001c.552 0 .999.437.999.96v8.621c0 1.919-1.447 1.919-1.999 1.919H5.5c-.552 0-1.999 0-1.999-1.919v-8.62c0-.53.443-.961.999-.961H6.5M7.519 4.538L10.019 2l2.5 2.513"></path>
                                    </g>
                                </g>
                            </svg>
                            <span class="action-title">分享</span>
                            <Share v-if="shareVisible" :boilingPointItemID="boilingData.id" :summary="boilingData.summary" :imgs="imgArr" @copyLink="onCopyLink" />
                        </div>
                    </div>
                </div>
            </div>
            <CommentList source="boilingpoint" :sourceID="boilingData.id" :user="user" 
                :authorID="boilingData.user.id" :rootCommentCount="boilingData.rootCommentCount" />
        </div>
    </li>
</template>

<script>
import striptags from 'striptags';
import { myHTTP } from '~/js/common/net.js';
import { jobCompany } from '~/js/common/filters.js';
import { ErrorCode } from '~/js/constants/error.js';
import UserBusinessCard from '~/js/components/user/UserBusinessCard.vue';
import More from '~/js/components/common/More.vue';
import Share from '~/js/components/boilingpoint/Share.vue';
import FollowBtn from '~/js/components/user/FollowBtn.vue';

const defMaxMiddleImgWidth = 446;
const gridTotalWidth = 336;// 9宫格总宽度
const gridGap = 6;// 格子之间的间距
// 有9个格子时，每个格子的宽高，这时格子的宽高比为1:1
const gridWidth =  (gridTotalWidth - 2 * gridGap) / 3;
// 只有一张图片，且图片宽高比为1:1时，这时图片的宽高
const ratio1x1Value = 180 * (gridTotalWidth / 250);

export default {
    props: [
        'boilingData', // 沸点数据
        'userID', // 当前登录用户的id
        'user', // 当前登录用户
        'maxMiddleImgWidth'
    ],
    data () {
        const imgs = this.boilingData.imgs;
        // imgWidth, imgHeight 是显示小缩略图时的宽高
        if (imgs.length === 1) {
            const smallImg = imgs[0];
            const ratio = smallImg.width / smallImg.height;
            if (ratio < 1 / 3) {
                smallImg.imgWidth = ratio1x1Value / 3;
                smallImg.imgHeight = ratio1x1Value;
            } else if (ratio >= 1 / 3 && ratio < 1) {
                smallImg.imgWidth = ratio1x1Value / ratio;
                smallImg.imgHeight = ratio1x1Value;
            } else if (ratio >= 1 && ratio < 3) {
                smallImg.imgWidth = ratio1x1Value;
                smallImg.imgHeight = ratio1x1Value / ratio;
            } else {
                smallImg.imgWidth = gridTotalWidth;
                smallImg.imgHeight = gridWidth;
            }
        } else if (imgs.length >= 2) {
            imgs.map(img => {
                img.imgWidth = gridWidth;
                img.imgHeight = gridWidth;
            });
        }
        let middleImgArr = (this.boilingData.middleImgs || []).map(imgData => {
            return {
                ...imgData,
                middleImgRotate: 0,
                style: {},
            };
        });
        middleImgArr = middleImgArr.map(img => this.updateMiddleImgStyle(img, { 
            isSwap: false, 
            // 此时，还不能访问this.data，主动传 this.maxMiddleImgWidth，因为props此时能访问
            maxMiddleImageWidth: this.maxMiddleImgWidth || defMaxMiddleImgWidth
        }));
        let bigImgArr = (this.boilingData.bigImgs || []).map(imgData => {
            return {
                ...imgData,
            };
        });
        return {
            maxMiddleImageWidth: this.maxMiddleImgWidth || defMaxMiddleImgWidth,
            gridTotalWidth,
            isContentExpand: false,
            partialContent: this.getPartialContent(this.boilingData.htmlContent),
            curImgIndex: 0,
            imgArr: imgs || [],
            middleImgArr,
            bigImgArr,
            reportVisible: false, // 是否显示举报
            gridVisible: true, // 是否显示九宫格
            middleImgVisible: false, // 是否显示中图
            middleImgCreated: false, // 中图组件是否已创建，用来避免每次切换中图图片时，都再次加载中图图片
            userCardVisible1: false, // 用户面板
            userCardVisible2: false, // 用户面板
            isFollowed: this.boilingData.user.isFollowed, // 是否已关注沸点作者
            expendIconOver: false,
            pinchIconOver: false,
            leftRotateIconOver: false,
            rightRotateIconOver: false,
            shareVisible: false,
            followedStyle: {
                'background-color': '#6cbd45', 
                'border-color': '#6cbd45', 
                width: '70px', 
                height: '26px'
            },
            notFollowedStyle: {
                'background-color': '#fff', 
                'border-color': '#6cbd45', 
                color: '#6cbd45', 
                width: '70px', 
                height: '26px'
            },
        };
    },
    computed: {
        curMiddleImg() {
            return this.middleImgArr[this.curImgIndex];
        },
        followText() {
            if (this.isFollowed && this.isMouseEnter) {
                return '取消关注';
            }
            if (this.isFollowed) {
                return '已关注';
            }
            return '关注';
        }
    },
    methods: {
        changeContentExpand() {
            this.isContentExpand = !this.isContentExpand;
        },
        getPartialContent(htmlContent) {
            let htmlDOM = (new DOMParser()).parseFromString(htmlContent, 'text/html');
            let pArr = htmlDOM.getElementsByTagName('p') || [];
            if (!pArr.length) {
                // 返回空字符串时，就显示完整沸点内容，否则，显示部分沸点内容
                return '';
            }
            let maxWordCount = 218; // 收起时，最多显示的字数
            const maxLineCount = 8; // 收起时，最多显示的行数
            let htmlStr = '';
            for (let i = 0; i < pArr.length; i++) {
                if (i > 0) {
                    // 每循环一次，得到p标签的innerHTML, innerHTML只包含文本或img标签
                    // 加 \n 相当于p标签的换行
                    htmlStr += '\n';
                    maxWordCount++; // 注意：\n 只是一个字符，而不是两个字符
                }
                htmlStr += pArr[i].innerHTML;
                if (i >= maxLineCount - 1) {
                    break;
                }
            }
            let isPartialContent = false;
            if (pArr.length > maxLineCount) {
                isPartialContent = true;
            }

            const reg = /<img\s+[^>]+\/?>/gi;
            const txtArr = htmlStr.split(reg);
            const imgArr = [];
            let curLength = 0;
            let finalStr = '';
            let execResult = reg.exec(htmlStr);
            while (execResult) {
                imgArr.push(execResult[0]);
                execResult = reg.exec(htmlStr);
            }
            for (let i = 0; i < txtArr.length; i++) {
                let str = '';
                if (curLength + txtArr[i].length <= maxWordCount) {
                    str = txtArr[i];
                    curLength += str.length;
                    if (imgArr[i]) {
                        str += imgArr[i];
                    }
                    finalStr += str;
                } else {
                    str = txtArr[i].substr(0, maxWordCount - curLength);
                    finalStr += str;
                    curLength = maxWordCount;
                    isPartialContent = true;
                    break;
                }
            }
            // 返回空字符串时，就显示完整沸点内容，否则，显示部分沸点内容
            return isPartialContent ? finalStr + '...' : '';
        },
        onCopyLink() {
            this.$emit('copyLink');
        },
        changeShareVisible() {
            this.shareVisible = !this.shareVisible;
        },
        clickoutsideShare() {
            this.shareVisible = false;
        },
        onMouseEnterUser1() {
            this.userCardVisible1 = true;
        },
        onMouseLeaveUser1() {
            this.userCardVisible1 = false;
        },
        onMouseEnterUser2() {
            this.userCardVisible2 = true;
        },
        onMouseLeaveUser2() {
            this.userCardVisible2 = false;
        },
        updateMiddleImgStyle(imgData, options) {
            options = options || {};
            // isSwap 是否交换宽高，图片旋转时可能要交换宽高
            options.isSwap = options.isSwap || false;
            options.transform = options.transform || 'rotate(0deg) translate(0px, 0px)';
            const maxMiddleImageWidth = options.maxMiddleImageWidth || this.maxMiddleImageWidth;
            let originalWidth, originalHeight, imgWidthKey, imgHeightKey;
            const imgSize = {};
            if (options.isSwap) {
                originalWidth = imgData.height;
                originalHeight = imgData.width;
                imgWidthKey = 'imgHeight';
                imgHeightKey = 'imgWidth';
            } else {
                originalWidth = imgData.width;
                originalHeight = imgData.height;
                imgWidthKey = 'imgWidth';
                imgHeightKey = 'imgHeight';
            }
            if (originalWidth > maxMiddleImageWidth) {
                imgSize[imgWidthKey] = maxMiddleImageWidth;
                imgSize[imgHeightKey] = originalHeight / (originalWidth / imgSize[imgWidthKey]);
            } else {
                imgSize[imgWidthKey] = originalWidth;
                imgSize[imgHeightKey] = originalHeight;
            }

            if (imgSize[imgHeightKey] > 1000) {
                imgSize[imgHeightKey] = 1000;
                imgSize[imgWidthKey] = originalWidth / (originalHeight / imgSize[imgHeightKey]);
            }
            imgData.style = {
                width: imgSize.imgWidth + 'px', 
                height: imgSize.imgHeight + 'px',
                displayHeight: imgSize[imgHeightKey] + 'px', // 中图父容器的实际高度
                left: (maxMiddleImageWidth - imgSize[imgWidthKey]) / 2 + 'px',
                transform: options.transform
            };
            return imgData;
        },
        // 点击了九宫格中的一张图片
        onClickImgGrid(index) {
            this.curImgIndex = index;
            this.gridVisible = false;
            this.middleImgVisible = true;
            this.middleImgCreated = true;
        },
        onExitMiddleImage() {
            this.gridVisible = true;
            this.middleImgVisible = false;
        },
        prevMiddleImg() {
            this.curImgIndex--;
        },
        changeMiddleImg(index) {
            this.curImgIndex = index;
        },
        nextMiddleImg() {
            this.curImgIndex++;
        },
        changeMiddleImgTransform(middleImgRotate) {
            const middleImg = this.curMiddleImg;
            const transformMap = {
                '0': 'rotate(0deg) translate(0px, 0px)',
                '1': 'rotate(90deg) translate(0px, -100%)',
                '2': 'rotate(180deg) translate(-100%, -100%)',
                '3': 'rotate(270deg) translate(-100%, 0px)'
            };
            middleImg.middleImgRotate += middleImgRotate;
            if (middleImg.middleImgRotate < 0) {
                middleImg.middleImgRotate = 3;
            }
            if (middleImg.middleImgRotate > 3) {
                middleImg.middleImgRotate = 0;
            }
            if (middleImg.middleImgRotate === 0 || middleImg.middleImgRotate === 2) {
                this.updateMiddleImgStyle(middleImg, {
                    isSwap: false,
                    transform: transformMap[middleImg.middleImgRotate],
                });
            } else {
                this.updateMiddleImgStyle(middleImg, {
                    isSwap: true,
                    transform: transformMap[middleImg.middleImgRotate],   
                });
            }
        },
        onReport() {
            this.reportVisible = !this.reportVisible;
        },
        clickoutsideReport() {
            this.reportVisible = false;
        },
        onLikeOrNot(boilingPoint) {
            let url = `/boilingpoints/${boilingPoint.id}/like`;
            if (!boilingPoint.userLiked) {
                myHTTP.post(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        boilingPoint.userLiked = true;
                        boilingPoint.likedCount++;
                    }
                });
            } else {
                myHTTP.delete(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        boilingPoint.userLiked = false;
                        boilingPoint.likedCount--;
                    }
                });
            }
        },
        onBrowseBigImage() {
            this.$emit('bigImageChange', this.bigImgArr, this.curImgIndex);
        },
        onFollowChange(userID, isFollowed) {
            this.$emit('userFollowChange', userID, isFollowed);
        },
        changeUserFollow(userID, isFollowed) {
            if (userID === this.boilingData.user.id) {
                this.isFollowed = isFollowed;
            }
        },
        onShowReportAlert() {
            this.$emit('report');  
        }
    },
    filters: {
        jobCompany,
    },
    components: {
        UserBusinessCard,
        More,
        Share,
        FollowBtn,
    }
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes myfadeIn {
    from {
        opacity: 0.5;
    }

    to {
        opacity: 1;
    }
}

@keyframes myfadeIn {
    from {
        opacity: 0.5;
    }

    to {
        opacity: 1;
    }
}

.myfadeIn {
    -webkit-animation-name: myfadeIn;
    animation-name: myfadeIn;
}

.boilingpoint-item {
    margin-bottom: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.boilingpoint-item-pin {
    background-color: #fff;
    border-radius: 2px;
}

.pin-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 0 20px;
}

.pin-header-row .account-group {
    align-items: center;
}

.account-group, .header-action {
    display: flex;
}

.pin-header-row .user-link {
    font-size: 0;
}

.avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.lazy {
    position: relative;
}

.pin-header-row .avatar {
    flex: 0 0 auto;
    width: 45px;
    height: 45px;
    border-radius: 50%;
}

.lazy:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: inherit;
    border-radius: inherit;
}

.lazy.loaded:before {
    opacity: 0;
    pointer-events: none;
}

.lazy:not(.immediate):before {
    transition: opacity .2s;
}

.pin-header-row .pin-header-content {
    margin-left: 12px;
}

.user-popover-box {
    display: inline;
    position: relative;
}

.pin-header-row .username {
    font-size: 15px;
    font-weight: 600;
    color: #2e3135;
}

.pin-header-row .username:hover {
    text-decoration: none;
}

.pin-header-row .meta-box {
    display: flex;
    align-items: center;
    margin: 4px 0 0;
    font-size: 13px;
    color: #8a9aa9;
    cursor: default;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pin-header-row .meta-box .position {
    max-width: 288px;
}

.pin-header-row .meta-box .dot {
    margin: 0 6px;
}

.pin-header-row .meta-box .time-box {
    color: #8a9aa9;
}

.pin-header-row .meta-box .time-box:hover {
    text-decoration: none;
}

.account-group, .header-action {
    display: flex;
}

.pin-header-more {
    position: relative;
}

.header-menu {
    margin-left: 16px;
}

.more-button {
    cursor: pointer;
}

svg:not(:root) {
    overflow: hidden;
}

.dropdown1 {
    position: absolute;
    margin-top: 6px;
    z-index: 1;
    left: -30px;
}

.dropdown-caret, .dropdown-caret:after {
    position: absolute;
    top: -11px;
    left: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ebebeb;
}

.dropdown-caret {
    left: 36px;
}

.dropdown-caret:after {
    content: "";
    top: -5px;
    left: -6px;
    border-bottom-color: #fff;
}

.dropdown-menu1 {
    display: block;
    padding: 6px 0;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #ebebeb;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, .06);
}

.dropdown-menu1 li {
    padding: 6px 0;
    display: block;
    font-size: 13px;
    color: #84878b;
    width: 82px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
}

.dropdown-menu1 li:hover {
    color: #64686e;
    background-color: #f8f8f8;
}

.pin-content-row {
    margin-left: 77px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 5px;
    position: relative;
}

.content-box {
    padding-right: 24px;
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    color: #17181a;
}

.pin-image-row, .pin-link-row, .pin-topic-row {
    position: relative;
    margin: 76px 48px 0 76px;
    margin-top: 10px;
}

.image-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.image {
    flex: 0 1 auto;
    position: relative;
    margin-top: 4px;
    max-width: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: zoom-in;
}

.image-box .image {
    width: 200px;
    margin-bottom: 6px;
    margin-right: 6px;
}

.no-right-margin {
    margin-right: 0!important;
}

.image .ratio-holder {
    pointer-events: none;
}

.pin-topic-row {
    margin-top: 8px;
}

.pin-topic-row .topic-title {
    font-size: 13px;
    display: inline-block;
    line-height: 22px;
    padding: 0 12px;
    border: 1px solid #ea6f5a;
    border-radius: 14px;
    color: #ea6f5a;
    user-select: none;
}

.pin-topic-row .topic-title:hover {
    text-decoration: none;
}

.action-box {
    display: flex;
    position: relative;
    margin-top: 16px;
    height: 34px;
    border-top: 1px solid #ebebeb;
}

.like-action, .comment-action, .share-action {
    cursor: default!important;
}

.action {
    flex: 1 1 33.333%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    cursor: pointer;
    user-select: none;
}

.action-title-box {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.action-title-box .icon {
    width: 18px;
    height: 18px;
    font-size: 12px;
}

.action-title-box .action-title {
    margin-left: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #8a93a0;
    line-height: 18px;
    height: 18px;
    border: 1px solid transparent;
    box-sizing: border-box;
}

.action:not(:last-child):after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -12px;
    width: 1px;
    height: 24px;
    background-color: #ebebeb;
}

.more-button:hover path {
    fill: #9da7b3;
}

.dropdown-caret:after {
    content: "";
    top: -5px;
    left: -6px;
    border-bottom-color: #fff;
}

.pin-carousel {
    width: 100%;
}

.action-bar {
    height: 32px;
    user-select: none;
    background-color: #f4f5f7;
}

.action-item {
    padding: 0 12px;
    display: inline-block;
    font-size: 13px;
    color: #76797e;
    cursor: pointer;
    line-height: 32px;
}

.action-item .icon {
    margin-right: 6px;
    vertical-align: middle;
}

.action-item .action-name, .action-item .icon {
    display: inline-block;
}

.action-item .action-name, .action-item .icon svg path {
    transition: .2s;
}

.carousel-body {
    position: relative;
    text-align: center;
    background-color: #f4f5f7;
    overflow: hidden;
    transition: height .2s;
}

.carousel-body .carousel-image {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    transform-origin: top left;
}

.carousel-body .toggle-area {
    position: absolute;
    top: 0;
    width: 30%;
    height: 100%;
    z-index: 1;
}

.hide-middle-img {
    display: none!important;
}

.carousel-body .toggle-area.zoomout {
    width: 100%;
    cursor: zoom-out;
    z-index: 0;
}

.carousel-body .toggle-area.prev {
    left: 0;
    cursor: url(../../../images/cursor-left.png), auto;
}

.carousel-body .toggle-area.next {
    right: 0;
    cursor: url(../../../images/cursor-right.png), auto;
}

.nav-list {
    margin-top: 8px;
    font-size: 0;
}

.nav-item {
    display: inline-block;
    width: 10.22222%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    margin-right: 8px;
}

.nav-item .thumb {
    position: relative;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    border: 2px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    opacity: .6;
    transition: .2s;
}

.nav-item .thumb.active, .nav-item .thumb:hover {
    border-color: #ea6f5a;
    opacity: 1;
}

.nav-item .thumb:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: .2s;
    content: "";
    display: block;
}

.nav-item .thumb:after {
    padding-top: 100%;
    content: "";
    display: block;
}

.action-item:not(.not-allow):hover {
    color: #ea6f5a;
}

.content-limit-btn {
    display: inline-block;
    margin-top: 5px;
    color: #ea6f5a;
    cursor: pointer;
    user-select: none;
}
</style>