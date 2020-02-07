import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tag } from '../entity/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { ListResult } from '../entity/listresult.entity';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Category } from '../entity/category.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async create(createTagDto: CreateTagDto) {
        const categoryIDArr: number[] = Array.from(new Set(createTagDto.categories));
        const categories: Category[] = categoryIDArr.map(cID => {
            const category = new Category();
            category.id = cID;
            return category;
        });

        const tag: Tag = new Tag();
        tag.name = createTagDto.name;
        tag.iconURL = createTagDto.iconURL;
        tag.followerCount = 0;
        tag.articleCount = 0;
        tag.categories = categories;
        tag.createdAt = new Date();
        tag.updatedAt = tag.createdAt;
        return await this.tagRepository.save(tag);
    }

    async update(updateTagDto: UpdateTagDto) {
        const categoryIDArr: number[] = Array.from(new Set(updateTagDto.categories));
        const insertCategories = [];

        categoryIDArr.map(cID => {
            insertCategories.push(`(${updateTagDto.id}, ${cID})`);
        });

        await this.tagRepository.manager.connection.transaction(async manager => {
            await manager.update(Tag, {
                id: updateTagDto.id,
            }, {
                name: updateTagDto.name,
                iconURL: updateTagDto.iconURL,
            });
            await manager.query(`DELETE FROM tag_category WHERE tag_id = ?`, [updateTagDto.id]);
            await manager.query(`INSERT INTO tag_category (tag_id, category_id) VALUES ${insertCategories.join(', ')}`);
        });
    }

    async detail(id: number) {
        return await this.tagRepository.findOne({
            select: ['id', 'name', 'followerCount', 'articleCount', 'iconURL', 'createdAt', 'updatedAt'],
            where: {
                id,
            },
        });
    }

    async list(page: number, pageSize: number, sort: string): Promise<ListResult<Tag>> {
        const [list, count] = await this.tagRepository.findAndCount({
            select: {
                id: true,
                name: true,
                articleCount: true,
                followerCount: true,
                iconURL: true,
                createdAt: true,
                updatedAt: true,
            },
            order: sort === 'popular' ? { followerCount: 'DESC' } : { updatedAt: 'DESC' },
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

    async all() {
        return await this.tagRepository.find({
            select: {
                id: true,
                name: true,
            },
        });
    }

    async listWithCategories(page: number, pageSize: number): Promise<ListResult<Tag>> {
        const [list, count] = await this.tagRepository.findAndCount({
            select: {
                id: true,
                name: true,
                articleCount: true,
                followerCount: true,
                iconURL: true,
                createdAt: true,
                updatedAt: true,
                categories: true,
            },
            relations: ['categories'],
            order: { updatedAt: 'DESC' },
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

    async listInCategory(categoryID: number) {
        return await this.tagRepository.createQueryBuilder('t')
            .select(['t.id', 't.name'])
            .leftJoin('t.categories', 'c')
            .where('c.id = :cID', { cID: categoryID})
            .getMany();
    }

    async searchInCategory(categoryID: number, q: string) {
        return await this.tagRepository.createQueryBuilder('t')
            .select(['t.id', 't.name'])
            .leftJoin('t.categories', 'c')
            .where('c.id = :cID', { cID: categoryID})
            .andWhere('t.name like :q', { q: `%${q}%` })
            .getMany();
    }

    async search(keyword: string, page: number, pageSize: number, sort: string): Promise<ListResult<Tag>> {
        const [list, count] = await this.tagRepository.findAndCount({
            select: {
                id: true,
                name: true,
                articleCount: true,
                followerCount: true,
                iconURL: true,
            },
            where: keyword ? { name: Like(`%${keyword}%`) } : {},
            order: sort === 'popular' ? { followerCount: 'DESC' } : { updatedAt: 'DESC' },
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

    /**
     * 用户关注了哪些标签
     */
    async userFollowTags(userID: number, page: number, pageSize: number): Promise<ListResult<Tag>> {
        const sql1 = `SELECT tags.id as id, tags.name as name, tags.article_count as articleCount,
                tags.follower_count as followerCount, tags.icon_url as iconURL
            FROM tags, user_subscribed_tag
            WHERE user_subscribed_tag.user_id = ? AND tags.id = user_subscribed_tag.tag_id
            ORDER BY user_subscribed_tag.created_at DESC
            LIMIT ?, ?`;
        const sql2 = `SELECT COUNT(*) as count FROM user_subscribed_tag
            WHERE user_subscribed_tag.user_id = ?`;
        const [list, count] = await Promise.all([
            this.tagRepository.manager.query(sql1, [userID, (page - 1) * pageSize, pageSize]),
            this.tagRepository.manager.query(sql2, [userID]),
        ]);
        return {
            list,
            count: count && count.length && parseInt(count[0].count, 10) || 0,
            page,
            pageSize,
        };
    }

    async isExists(id: number): Promise<boolean> {
        const tag = await this.tagRepository.findOne({
            select: ['id'],
            where: { id },
        });
        return !!tag;
    }

    async addFollower(tagID: number, userID: number) {
        await this.tagRepository.manager.connection.transaction(async manager => {
            await manager.query('INSERT INTO user_subscribed_tag (user_id, tag_id, created_at) VALUES(?, ?, ?)', [userID, tagID, new Date()]);
            await manager.query('UPDATE tags SET follower_count = follower_count + 1 WHERE id = ?', [tagID]);
        });
    }

    async removeFollower(tagID: number, userID: number) {
        await this.tagRepository.manager.connection.transaction(async manager => {
            await manager.query('DELETE FROM user_subscribed_tag WHERE user_id = ? AND tag_id = ?', [userID, tagID]);
            await manager.query('UPDATE tags SET follower_count = follower_count - 1 WHERE id = ?', [tagID]);
        });
    }

    /**
     * 给定一组tag，根据 followerID 来过滤被用户关注的tag
     */
    async tagsFilterByFollowerID(tags: number[], followerID: number) {
        if (!tags || tags.length <= 0) {
            return [];
        }
        const sql = `SELECT user_id as userID, tag_id as tagID FROM user_subscribed_tag
            WHERE user_id = ? AND tag_id IN (?)`;
        return await this.tagRepository.manager.query(sql, [followerID, tags.join(',')]);
    }

    /**
     * 用户是否关注了此标签
     */
    async isFollowed(tagID: number, userID: number): Promise<boolean> {
        const sql = `SELECT user_subscribed_tag.user_id FROM user_subscribed_tag WHERE user_id = ? AND tag_id = ?`;
        const arr = await this.tagRepository.manager.query(sql, [userID, tagID]);
        return arr && arr.length > 0;
    }
}