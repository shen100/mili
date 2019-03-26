<template>
    <div>
        <div class="menu">全部投稿请求</div>
        <div v-if="alreadyLoad && !this.msgArr.length" class="find-nothing">
            <img src="../../../images/message/post_nocontent.png"> 
            <div>还没有投稿哦~休息一下吧</div>
        </div>
    
        <Pinterest url="/messages/post" @load="onLoad">
            <template v-slot:loading>
                <div class="article-placeholder index">
                    <div class="content">
                        <div class="title"></div>
                        <div class="text"></div>
                        <div class="text animation-delay"></div>
                        <div class="meta">
                            <div class="read"></div><i class="iconfont ic-list-comments"></i>
                            <div class="small"></div><i class="iconfont ic-list-like"></i>
                            <div class="small"></div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <ul class="note-list" style="padding-top: 20px;">
                    <li :key="msg.id" v-for="msg in msgArr">
                        <div class="content">
                            <div class="author">
                                <a :href="`/u/${msg.author.id}`" class="avatar">
                                    <img :src="msg.author.avatarURL">
                                </a> 
                                <div class="info">
                                    <a :href="`/u/${msg.author.id}`" class="nickname">{{msg.author.username}}</a> 
                                    <span class="time">{{msg.createdAtRecentLabel}}</span>
                                </div>
                            </div> 
                            <a :href="`/p/${msg.article.id}.html`" target="_blank" class="title">{{msg.article.name}}</a> 
                            <p class="abstract">{{msg.article.summary}}...</p> 
                            <div class="meta">
                                <a :href="`/p/${msg.article.id}`"><i class="iconfont ic-list-read"></i> {{msg.article.browseCount}}</a> 
                                <a :href="`/p/${msg.article.id}#comments`">
                                    <i class="iconfont ic-list-comments"></i> {{msg.article.commentCount}}
                                </a> 
                                <span><i class="iconfont ic-list-like"></i> {{msg.article.likeCount}}</span> 
                            </div>
                        </div> 
                        <div class="push-action">
                            <template v-if="msg.status === ArticleCollectionStatus.Auditing">
                                <a @click="onReceive(msg, ArticleCollectionStatus.Collected)" class="btn btn-hollow">接受</a> 
                                <a @click="onReceive(msg, ArticleCollectionStatus.NotCollect)" class="btn btn-gray">拒绝</a>
                            </template>
                            <span v-else-if="msg.status === ArticleCollectionStatus.Collected" class="push-time" style="font-weight: 700;">已收录</span>
                            <span v-else-if="msg.status === ArticleCollectionStatus.NotCollect" class="push-time" style="font-weight: 700;">已拒绝</span>
                            <span class="push-time">{{msg.createdAtLabel}} 投稿到专题</span>
                            <a class="collection" :href="`/collections/${msg.collection.id}.html`">{{msg.collection.name}}</a>
                        </div>
                    </li>
                </ul>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { ArticleCollectionStatus } from '~/js/constants/entity.js';
import { myHTTP } from '~/js/common/net.js';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    name: 'PostArticle',
    data: function() {
        return {
            msgArr: [],
            alreadyLoad: false,
            ArticleCollectionStatus: ArticleCollectionStatus,
        };
    },
    methods: {
        onLoad(result) {
            if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                this.msgArr = this.msgArr.concat(result.data.data.list);
                this.alreadyLoad = true;
            }
        },
        onReceive(msg, status) {
            const url = `/collections/${msg.collection.id}/articles/${msg.article.id}/${msg.id}/${status}`;
            myHTTP.put(url)
                .then((result) => {
                    if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        msg.status = result.data.data.status;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    components: {
        Pinterest,
    }
};
</script>
