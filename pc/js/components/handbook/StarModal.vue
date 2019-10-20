<template>
    <div v-if="modalVisible" class="handbook-modal">
        <ErrorTip ref="errorTip" />
        <div @click="onClose" class="handbook-modal-bg"></div>
        <div class="handbook-modal-box">
            <div style="position: relative;">
                <div class="inner">
                    <button @click="onClose" type="button" class="close">×</button>
                    <div class="top">
                        <div class="star-content">
                            <div class="heading">请为此{{bookTypeLabel}}打分</div>
                            <div class="name">{{user.username}}，恭喜你已读完此{{bookTypeLabel}}。</div>
                            <div class="star-panel">
                                <div @click="onStarClick(i)" :key="i" v-for="i in 5" class="star" :class="{'star-selected': starCount && i <= starCount}"></div>
                                <div v-if="starCount" class="star-title">{{starLabel}}</div>
                            </div>
                        </div>
                        <div class="aside">
                            <img :src="book.coverURL">
                        </div>
                    </div>
                    <div class="text-content">
                        <textarea v-model="content" placeholder="说说你的感受吧…"></textarea>
                    </div>
                    <p class="remark">备注：评价审核通过后将在{{bookTypeLabel}}详情页显示</p>
                    <div class="bottom">
                        <button @click="onCommit" class="submit-btn" :class="{'submit-disabled': !submitEnabled}">提交评价</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';

export default {
    props: ['user', 'book', 'type'],
    data() {
        return {
            modalVisible: false,
            starCount: 0,
            content: '',
        };
    },
    computed: {
        starLabel() {
            return {
                1: '很差',
                2: '较差',
                3: '还行',
                4: '给力',
                5: '超赞'
            }[this.starCount];
        },
        submitEnabled() {
            if (!this.starCount) {
                return false;
            }
            return true;
        },
        bookTypeLabel() {
            return {
                'book': '图书',
                'handbook': '小册',
            }[this.type];
        }
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onStarClick(starCount) {
            this.starCount = starCount;
        },
        onClose() {
            this.modalVisible = false;
        },
        onSuccess() {
            this.modalVisible = false;
        },
        show() {
            this.modalVisible = true;  
        },
        onCommit() {
            if (!this.starCount) {
                return;
            }
            myHTTP.post('/books/star', {
                bookID: this.book.id,
                star: this.starCount,
                htmlContent: this.content || undefined,
            }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$emit('commit', res.data.data);
                    this.modalVisible = false;
                } else {
                    this.$refs.errorTip.show(res.data.message);
                }
            }).catch((err) => {
            });
        }
    },
    components: {
        ErrorTip,
    }
}
</script>

<style lang="scss" scoped>
.handbook-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
    overflow-x: hidden;
    overflow-y: hidden;
}

.handbook-modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .8);
}

.handbook-modal-box {
    width: 765px;
    height: 500px;
    padding: 0 45px;
    background: #fff;
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    border-radius: 2px;
    top: 50%;
    margin-top: -250px;
    box-sizing: border-box;
}

.comment-editor-box {
    margin-top: 0;
}

.handbook-modal-box .close {
    font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    line-height: 1;
    color: #000;
    opacity: .4;
    filter: alpha(opacity=20);
    font-weight: 200;
    font-size: 32px;
    outline: none;
    text-shadow: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    position: absolute;
    top: 3px;
    right: -38px;
}

.mark-star-masker .inner {
    position: relative;
    width: 675px;
    min-height: 500px;
    padding: 30px 45px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #fff;
}

.handbook-modal .inner {
    position: relative;
    width: 675px;
    padding: 0;
    padding-top: 30px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #fff;
}

.handbook-modal .inner .top {
    display: flex;
}

.handbook-modal .inner .top .star-content {
    flex-grow: 1;
}

.handbook-modal .inner .top .star-content .heading {
    font-size: 34px;
    color: #232323;
    font-weight: 700;
}

.handbook-modal .inner .top .star-content .name {
    margin-top: 10px;
    font-size: 21px;
    font-weight: 700;
    color: #5d7084;
}

.handbook-modal .inner .top .star-content .star-panel {
    margin-top: 30px;
    display: flex;
}

.handbook-modal .inner .top .star-content .star-panel .star {
    width: 25px;
    height: 25px;
    margin-right: 12px;
    background-image: url(../../../images/handbook/star2.svg);
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    cursor: pointer;
}

.handbook-modal .inner .top .star-content .star-panel .star.star-selected {
    background-image: url(../../../images/handbook/star_selected.svg);
    background-size: contain;
}

.handbook-modal .inner .top .star-content .star-panel .star-title {
    color: #e88200;
    font-size: 17px;
    height: 25px;
    line-height: 27px;
    font-weight: 700;
}

.handbook-modal .inner .top .aside {
    margin-left: 100px;
    flex-shrink: 0;
    width: 110px;
    height: 154px;
}

.handbook-modal .inner .top .aside img {
    width: 100%;
    display: block;
    box-shadow: 0 10px 25px 0 rgba(93, 93, 93, .3);
}

.handbook-modal .inner .text-content {
    margin-top: 25px;
}

.handbook-modal textarea {
    display: block;
    box-shadow: none;
    transition: border .3s;
    background-color: #fff;
    text-align: justify;
    width: 100%;
    box-sizing: border-box;
    height: 140px;
    padding: 20px;
    border-radius: 2px;
    font-size: 16px;
    outline: none;
    border: 1px solid rgba(93, 112, 132, .2);
    color: #5d7084;
    resize: none;
}

.handbook-modal textarea::-webkit-input-placeholder {
    color: #999;
}

.handbook-modal .inner .remark {
    margin-top: 10px;
    font-size: 13px;
    color: #5d7084;
}

.handbook-modal .inner .bottom {
    text-align: center;
    margin-top: 40px;
}

.handbook-modal .inner .bottom .submit-btn {
    -webkit-appearance: none;
    appearance: none;
    background-color: #ea6f5a;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: 6px 16px;
    outline: none;
    transition: background-color .3s,color .3s;
    cursor: pointer;
    width: 160px;
    height: 46px;
    line-height: 34px;
    font-size: 20px;
}

.submit-disabled {
    cursor: not-allowed!important;
    opacity: .5;
}
</style>