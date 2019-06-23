import * as _ from 'lodash';
import * as marked from 'marked';
import * as striptags from 'striptags';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';
import { ConfigService } from '../config/config.service';

const defaultSummary = `## 作者介绍

## 小册介绍

## 你会学到什么？

## 适宜人群

## 购买须知

1. 本小册为图文形式内容服务，共计 N 节
2. 全部文章预计 x 月 x 日更新完成；
3. 购买用户可享有小册永久的阅读权限；
4. 购买用户可进入小册微信群，与作者互动；
5. {{siteName}}小册为虚拟内容服务，一经购买成功概不退款；
6. {{siteName}}小册版权归{{companyName}}所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7. 在{{siteName}}小册阅读过程中，如有任何问题，请邮件联系{{xiaoceEmail}}
`;

@Injectable()
export class HandBookService {
    constructor(
        @InjectRepository(HandBook)
        private readonly handBookRepository: Repository<HandBook>,

        @InjectRepository(HandBookChapter)
        private readonly handBookChapterRepository: Repository<HandBookChapter>,

        private readonly configService: ConfigService,
    ) {}

    async create(userID: number) {
        let summary = defaultSummary;
        let regExp = new RegExp('{{xiaoceEmail}}', 'g');
        summary = summary.replace(regExp, this.configService.server.xiaoceEmail);
        regExp = new RegExp('{{siteName}}', 'g');
        summary = summary.replace(regExp, this.configService.server.siteName);
        regExp = new RegExp('{{companyName}}', 'g');
        summary = summary.replace(regExp, this.configService.server.companyName);

        const handBook = new HandBook();
        handBook.name = '';
        handBook.saleCount = 0;
        handBook.summary = summary;
        handBook.coverURL = '';
        handBook.userID = userID;
        handBook.createdAt = new Date();
        handBook.updatedAt = handBook.createdAt;
        return await this.handBookRepository.save(handBook);
    }

    async updateSummary(id: number, summary: string, userID: number) {
        return await this.handBookRepository.update({
            id,
            userID,
        }, {
            summary,
        });
    }

    async basic(id: number) {
        return await this.handBookRepository.findOne({
            select: ['id', 'name', 'summary'],
            where: {
                id,
            },
        });
    }

    async isOwner(id: number, userID) {
        const handbook = await this.handBookRepository.findOne({
            select: ['id'],
            where: {
                id,
                userID,
            },
        });
        return !!handbook;
    }

    async getChapters(bookID: number) {
        return await this.handBookChapterRepository.find({
            select: {
                id: true,
                name: true,
                tryRead: true,
            },
            where: {
                bookID,
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    async getChapter(chapterID: number) {
        return await this.handBookChapterRepository.findOne({
            select: {
                id: true,
                name: true,
                content: true,
                userID: true,
                tryRead: true,
            },
            where: {
                id: chapterID,
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    async createChapter(bookID: number, chapterName: string, userID: number) {
        const chapter = new HandBookChapter();
        chapter.name = chapterName;
        chapter.bookID = bookID;
        chapter.userID = userID;
        chapter.browseCount = chapter.commentCount = 0;
        chapter.createdAt = new Date();
        chapter.tryRead = false;
        chapter.updatedAt = chapter.createdAt;
        return await this.handBookChapterRepository.save(chapter);
    }

    async updateChapterTitle(id: number, name: string, userID: number) {
        return await this.handBookChapterRepository.update({
            id,
            userID,
        }, {
            name,
        });
    }

    async updateChapterContent(id: number, content: string, userID: number) {
        const htmlContent = marked(content);
        let text = striptags(htmlContent);
        text = text.replace(/^\s+|\s+$/g, '');
        text = text.replace(/\s+|\n$/g, ' ');
        const wordCount = text.length;

        return await this.handBookChapterRepository.update({
            id,
            userID,
        }, {
            content,
            htmlContent,
            wordCount,
        });
    }

    async updateChapterTryRead(id: number, tryRead: boolean, userID: number) {
        return await this.handBookChapterRepository.update({
            id,
            userID,
        }, {
            tryRead: !!tryRead,
        });
    }
}