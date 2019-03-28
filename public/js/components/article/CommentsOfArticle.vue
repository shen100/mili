<template>
    <div id="comments" class="comments">
        <div :key="`comment-${comment.id}`" :id="`comment-${comment.id}`" v-for="(comment, i) in comments" class="comment">
            <div>
                <div class="author">
                    <div class="v-tooltip-container" style="z-index: 0;">
                        <div class="v-tooltip-content">
                            <a :href="`/u/${comment.user.id}.html`" target="_blank" class="avatar"><img :src="comment.user.avatarURL"></a>
                        </div>
                    </div>
                    <div class="info">
                        <a :href="`/u/${comment.user.id}.html`" target="_blank" class="name">{{comment.user.username}}</a> 
                        <div class="meta"><span>{{i + 1}}楼 · 2019.02.26 00:37</span></div>
                    </div>
                </div>
                <div class="comment-wrap">
                    <p>{{comment.content}}</p>
                    <div class="tool-group">
                        <a :id="`like-button-${comment.id}`" class="like-button">
                            <span>{{comment.likeCount}}人赞</span>
                        </a>
                        <a>
                            <i class="iconfont ic-comment"></i>
                            <span>回复</span>
                        </a>
                        <a class="report"><span>举报</span></a>
                    </div>
                </div>
            </div>
            <div class="sub-comment-list">
                <div :key="`comment-${subcomment.id}`" v-for="subcomment in comment.comments" :id="`comment-${subcomment.id}`" class="sub-comment">
                    <div class="v-tooltip-box">
                        <div class="v-tooltip-container" style="z-index: 0;">
                            <div class="v-tooltip-content">
                                <a :href="`/u/${subcomment.user.id}.html`" target="_blank">{{subcomment.user.username}}</a>：
                            </div>
                        </div>
                        <span v-if="subcomment.parentComment"><a :href="`/u/${subcomment.parentComment.user.id}.html`" class="maleskine-author" target="_blank">@{{subcomment.parentComment.user.username}}</a> {{subcomment.content}}</span> 
                    </div>
                    <div class="sub-tool-group">
                        <span>2019.03.02 16:49</span>
                        <a class=""><i class="iconfont ic-comment"></i> <span>回复</span></a> 
                        <a class="report"><span>举报</span></a>
                    </div>
                </div>
                <div class="sub-comment more-comment">
                    <a class="add-comment-btn">
                        <i class="iconfont ic-subcomment"></i> 
                        <span>添加新评论</span>
                    </a>
                    <span class="line-warp">
                        <a>收起</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';

export default {
    name: 'App',
    data: function() {
        return {
            articleID: 1,
            comments: [
                {
                    id: 1,
                    content: '面基死。',
                    user: {
                        id: 644,
                        avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                    },
                    comments: []
                },
                {
                    id: 2,
                    content: '哈哈哈，只能说这个世界有太多让女人变美的工具。。。。',
                    user: {
                        id: 644,
                        avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                    },
                    comments: [
                        {
                            id: 10,
                            content: '世界有太多让女人变美的',
                            user: {
                                id: 644,
                                username: 'java',
                                avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                            },
                        },
                        {
                            id: 11,
                            content: '多让女人变美的工',
                            user: {
                                id: 644,
                                username: 'mk',
                                avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                            },
                            parentComment: {
                                user: {
                                    id: 10,
                                    username: 'shen100'
                                }
                            }
                        },
                        {
                            id: 12,
                            content: '世界有太多',
                            user: {
                                id: 644,
                                username: 'mk',
                                avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                            },
                        },
                    ]
                },
                {
                    id: 3,
                    content: '前几天我被一个大叔控的女孩子追，我91她02，一开始挺介意年龄的，后来想着试试谈吧，聊了一个星期快要奔现我就拒绝掉了',
                    user: {
                        id: 644,
                        avatarURL: 'http://tva2.sinaimg.cn/crop.0.0.180.180.180/79d20cbbjw1e8qgp5bmzyj2050050aa8.jpg'
                    },
                    comments: []
                }
            ],
        };
    },
    mounted: function() {
    },
    methods: {
        reqComments() {
            // const url = `/articles/${this.articleID}/comments`;
            // myHTTP.get(url).then((res) => {
            //     this.comments = this.comments.concat(res.data.data.comments);
            // });
        },
    },
    components: {
    }
};
</script>
