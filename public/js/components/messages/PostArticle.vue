<template>
    <div>
        <div class="menu">全部投稿请求</div>
        <div class="find-nothing">
            <img src="../../../images/message/post_nocontent.png"> 
            <div>投稿都处理完啦~休息一下吧</div>
        </div>
    
        <Pinterest>
            <template v-slot:placeholder>
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
            <ul class="note-list">
                <li>
                    <div class="content">
                        <div class="author">
                            <a href="/u/cdc61707f1ff" class="avatar">
                                <img src="//cdn261.jpg">
                            </a> 
                            <div class="info">
                                <a href="/u/cdc61707f1ff" class="nickname">yuan8058</a> 
                                <span class="time">1 分钟前</span>
                            </div>
                        </div> 
                        <a href="/p/5ff8c6ed4165" target="_blank" class="title">2019-03-24</a> 
                        <p class="abstract">asdfafasdfasdfsafafa</p> 
                        <div class="meta">
                            <a href="/p/5ff8c6ed4165"><i class="iconfont ic-list-read"></i> 0</a> 
                            <a href="/p/5ff8c6ed4165#comments">
                                <i class="iconfont ic-list-comments"></i> 0
                            </a> 
                            <span><i class="iconfont ic-list-like"></i> 0</span> 
                        </div>
                    </div> 
                    <div class="push-action">
                        <a class="btn btn-hollow">接受</a> 
                        <a class="btn btn-gray">拒绝</a>
                        <span class="push-time">2019.03.24 21:27 投稿</span>
                    </div>
                </li>
            </ul>
        </Pinterest>
    </div>
</template>

<script>
import { CollectionStatus } from '~/js/constants/entity.js';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { trim } from '~/js/utils/utils.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';

export default {
    name: 'PostArticle',
    data: function() {
        return {
        };
    },
    methods: {
        reqMyArticles() {
           
        },
    },
    components: {
    }
};
</script>
