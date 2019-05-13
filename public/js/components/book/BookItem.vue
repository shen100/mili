<template>
    <div>
        <a :href="`/books/${bookData.id}.html`" target="_blank" class="item">
            <div class="poster">
                <div class="lazy thumb poster-img loaded" :style="{'background-image': `url(${bookData.coverURL})`}" style="background-size: cover;"></div>
            </div>
            <div class="info">
                <div class="title">
                    <span>{{bookData.name}}</span>
                </div>
                <div class="desc">{{bookData.summary}}</div>
                <div class="author">
                    <div class="author-info">
                        <div target="_blank" class="user">
                            <div class="lazy avatar hero loaded" :style="{'background-image': `url(${bookData.user.avatarURL})`}"></div>
                            <span>{{bookData.user.username}}</span>
                        </div>
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
                            <span>{{bookData.userCount}}</span>
                            <span>人已阅读</span>
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


