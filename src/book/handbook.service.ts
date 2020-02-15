import * as _ from 'lodash';
import * as marked from 'marked';
import * as striptags from 'striptags';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';
import { ConfigService } from '../config/config.service';
import { CreateHandBookDto } from './dto/create-handbook.dto';
import { UpdateHandBookDto } from './dto/update-handbook.dto';
import { ListResult } from '../entity/listresult.entity';
import { MarkedConstants } from '../constants/article';

marked.setOptions(MarkedConstants.options);

const defaultIntroduce = `## 作者介绍

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

    async create(userID: number, dto: CreateHandBookDto) {
        let introduce = defaultIntroduce;
        let regExp = new RegExp('{{xiaoceEmail}}', 'g');
        introduce = introduce.replace(regExp, this.configService.server.xiaoceEmail);
        regExp = new RegExp('{{siteName}}', 'g');
        introduce = introduce.replace(regExp, this.configService.server.siteName);
        regExp = new RegExp('{{companyName}}', 'g');
        introduce = introduce.replace(regExp, this.configService.server.companyName);

        const handBook = new HandBook();
        handBook.name = dto.name;
        handBook.saleCount = 0;
        handBook.introduce = introduce;
        handBook.summary = '';
        handBook.price = 0;
        handBook.authorIntro = '';
        handBook.isAllDone = false;
        handBook.coverURL = '';
        handBook.userID = userID;
        handBook.createdAt = new Date();
        handBook.updatedAt = handBook.createdAt;
        return await this.handBookRepository.save(handBook);
    }

    async updateIntroduce(id: number, introduce: string, userID: number) {
        return await this.handBookRepository.update({
            id,
            userID,
        }, {
            introduce: introduce || '',
        });
    }

    async updateHandBook(id: number, dto: UpdateHandBookDto, userID: number) {
        const data = {
            name: dto.name || '',
            summary: dto.summary || '',
            authorIntro: dto.authorIntro || '',
            price: dto.price || 0,
            completionAt: dto.completionAt ? new Date(dto.completionAt) : null,
            isAllDone: dto.isAllDone,
            isAgree: dto.isAgree,
        };
        if (!data.completionAt) {
            delete data.completionAt;
        }
        return await this.handBookRepository.update({
            id,
            userID,
        }, {
            name: data.name,
            summary: data.summary,
            authorIntro: data.authorIntro,
            price: data.price,
            completionAt: data.completionAt,
            isAllDone: data.isAllDone,
            isAgree: data.isAgree,
        });
    }

    async detail(id: number) {
        return await this.handBookRepository.findOne({
            select: ['id', 'name', 'introduce', 'summary', 'authorIntro', 'price', 'completionAt', 'isAllDone', 'coverURL', 'isAgree'],
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

    /**
     * 撰写的小册
     */
    async getMyHandBooks(userID: number, page: number, pageSize: number): Promise<ListResult<HandBook>> {
        const [ list, count ] = await this.handBookRepository.findAndCount({
            select: {
                id: true,
                name: true,
                summary: true,
                saleCount: true,
                price: true,
                createdAt: true,
                user: {
                    id: true,
                    username: true,
                },
            },
            where: {
                userID,
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
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
        chapter.rootCommentCount = 0;
        chapter.tryRead = false;
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

    async updateChapterTryRead(id: number, tryRead: boolean, userID: number) {
        return await this.handBookChapterRepository.update({
            id,
            userID,
        }, {
            tryRead: !!tryRead,
        });
    }

    async deleteChapter(id: number, userID: number) {
        return await this.handBookChapterRepository.delete({
            id,
            userID,
        });
    }
}