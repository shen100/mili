import * as _ from 'lodash';
import * as marked from 'marked';
import * as striptags from 'striptags';
import { Injectable } from '@nestjs/common';
import { ArticleContentType } from '../entity/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Draft } from '../entity/draft.entity';
import { CreateDraftDto } from './dto/create-draft.dto';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class DraftService {
    constructor(
        @InjectRepository(Draft)
        private readonly draftRepository: Repository<Draft>,
    ) {}

    async create(createDraftDto: CreateDraftDto, userID: number) {
        const uniqCates = _.uniqBy(createDraftDto.categories, (c) => c.id);
        const categories: Category[] = uniqCates.map(cate => {
            const c = new Category();
            c.id = cate.id;
            return c;
        });
        const uniqTags = _.uniqBy(createDraftDto.tags, (t) => t.id);
        const tags: Tag[] = uniqTags.map(t => {
            const tag = new Tag();
            tag.id = t.id;
            return tag;
        });
        const draft = new Draft();
        draft.name = createDraftDto.name;
        draft.categories = categories;
        draft.tags = tags;
        draft.contentType = createDraftDto.contentType;
        if (draft.contentType === ArticleContentType.Markdown) {
            draft.content = createDraftDto.content;
            draft.htmlContent = marked(createDraftDto.content);
        } else {
            draft.htmlContent = createDraftDto.content;
        }
        let plainText = striptags(draft.htmlContent);
        plainText = plainText.replace(/^\s+|\s+$/g, '');
        plainText = plainText.replace(/\s+|\n$/g, ' ');
        draft.wordCount = plainText.length;
        draft.userID = userID;
        draft.createdAt = new Date();
        draft.updatedAt = draft.createdAt;
        return await this.draftRepository.save(draft);
    }

    async delete(id: number, userID: number) {
        await this.draftRepository.manager.connection.transaction(async manager => {
            await manager.createQueryBuilder()
                .delete()
                .from('drafts')
                .where('id = :id and user_id = :userID', { id, userID })
                .execute();

            await manager.createQueryBuilder()
                .delete()
                .from('draft_category')
                .where('draft_id = :id', { id })
                .execute();
        });
    }

    async list(page: number, limit: number) {
        return await this.draftRepository.find({
            select: {
                id: true,
                name: true,
                createdAt: true,
                wordCount: true,
                contentType: true,
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async detail(id: number) {
        return await this.draftRepository.findOne({
            select: {
                id: true,
                name: true,
                content: true,
                htmlContent: true,
                createdAt: true,
                wordCount: true,
                contentType: true,
            },
            relations: ['categories', 'tags'],
            where: {
                id,
            },
        });
    }

    async count(): Promise<number> {
        return await this.draftRepository.count({});
    }
}