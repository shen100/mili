import * as _ from 'lodash';
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
        handBook.coverURL = '';
        handBook.userID = userID;
        handBook.createdAt = new Date();
        handBook.updatedAt = handBook.createdAt;
        return await this.handBookRepository.save(handBook);
    }

    async basic(id: number) {
        return await this.handBookRepository.findOne({
            select: ['id', 'name'],
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

    async chapters(bookID: number) {
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

    async createChapter(bookID: number, userID: number) {
        const chapter = new HandBookChapter();
        chapter.name = '';
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
}