<template>
    <div>
        <a class="item">
            <div class="poster">
                <a :href="`/books/${bookData.id}`" target="_blank">
                    <div class="lazy thumb poster-img loaded" :style="{'background-image': `url(${bookData.coverURL})`}" style="background-size: cover;"></div>
                </a>
            </div>
            <div class="info">
                <a :href="`/books/${bookData.id}`" target="_blank" class="title">
                    <span>{{bookData.name}}</span>
                </a>
                <div class="desc" v-html="bookData.summary"></div>
                <div class="author">
                    <div class="author-info">
                        <a :href="`/uc/${bookData.user.id}`" target="_blank" class="user">
                            <div class="lazy avatar hero loaded" :style="{'background-image': `url(${bookData.user.avatarURL})`}"></div>
                            <span>{{bookData.user.username}}</span>
                        </a>
                    </div>
                    <div class="author-desc">
                    </div>
                </div>
                <div class="other">
                    <div class="messages">
                        <span class="message">
                            <span>{{bookData.chapterCount}}小节</span>
                        </span>
                        <span class="dot">·</span>
                        <span class="message">
                            <span>阅读时长{{bookData.wordCount | readDuration}}</span>
                        </span>
                        <span class="dot">·</span>
                        <span class="message">
                            <span>{{bookData.userStudyCount}}</span>
                            <span>人已学习</span>
                        </span>
                    </div>
                </div>
                <div class="footer-bar" style="display: none;"></div>
            </div>
        </a>
    </div>
</template>

<script>
import { replaceIgnoreCase } from '~/js/utils/utils.js';
import { readDuration } from '~/js/utils/utils.js';

export default {
    props: [
        'keyword',
        'book'
    ],
    data () {
        const strongHTML = `<em style="color: #e8001c">${this.keyword}</em>`;
        const bookData = {
            ...this.book,
        };
        bookData.summary = (bookData.summary || '') + '...';
        if (this.keyword) {
            bookData.name = replaceIgnoreCase(bookData.name, this.keyword, strongHTML);
            bookData.summary = replaceIgnoreCase(bookData.summary, this.keyword, strongHTML);
        }
        return {
            bookData,
        };
    },
    filters: {
        readDuration,
    }
}
</script>


