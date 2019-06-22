import * as _ from 'lodash';
import * as marked from 'marked';
import * as striptags from 'striptags';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';

@Injectable()
export class HandBookService {
    constructor(
        @InjectRepository(HandBook)
        private readonly handBookRepository: Repository<HandBook>,

        @InjectRepository(HandBookChapter)
        private readonly handBookChapterRepository: Repository<HandBookChapter>,
    ) {}

    async create(userID: number) {
        const handBook = new HandBook();
        handBook.name = '';
        handBook.saleCount = 0;
        handBook.summary = '';
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
}