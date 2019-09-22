import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tag } from '../entity/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { OSSService } from '../common/oss.service';
import { ListResult } from '../entity/listresult.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,

        private readonly ossService: OSSService,
    ) {}

    async create(createTagDto: CreateTagDto) {
        const imgURL = await this.ossService.uploadFromStreamURL(createTagDto.iconURL);
        const tag: Tag = new Tag();
        tag.name = createTagDto.name;
        tag.iconURL = imgURL;
        tag.followerCount = 0;
        tag.articleCount = 0;
        tag.createdAt = new Date();
        return await this.tagRepository.save(tag);
    }

    async detail(id: number) {
        return await this.tagRepository.findOne({
            select: ['id', 'name', 'followerCount', 'articleCount', 'iconURL', 'createdAt'],
            where: {
                id,
            },
        });
    }

    async list(page: number, pageSize: number, order: string, keyword: string): Promise<ListResult<Tag>> {
        const [list, count] = await this.tagRepository.findAndCount({
            select: {
                id: true,
                name: true,
                articleCount: true,
                followerCount: true,
                iconURL: true,
            },
            where: keyword ? { name: Like(`%${keyword}%`) } : {},
            order: order === 'hot' ? { followerCount: 'DESC' } : { createdAt: 'DESC' },
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

    async subscribedList(userID: number, page: number, pageSize: number, order: string, keyword: string): Promise<ListResult<Tag>> {
        const orderField = order === 'hot' ? 'follower_count' : 'created_at';
        const likeSQL = keyword ? `AND tags.name LIKE "%${keyword}%"` : '';
        const sql1 = `SELECT tags.id as id, tags.name as name, tags.article_count as articleCount,
                tags.follower_count as followerCount, tags.icon_url as iconURL
            FROM tags, user_subscribed_tag
            WHERE user_subscribed_tag.user_id = ${userID} AND tags.id = user_subscribed_tag.tag_id ${likeSQL}
            ORDER BY ${orderField} DESC
            LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
        const sql2 = `SELECT COUNT(*) as count FROM tags, user_subscribed_tag
            WHERE user_subscribed_tag.user_id = ${userID} AND tags.id = user_subscribed_tag.tag_id`;
        const [list, count] = await Promise.all([
            this.tagRepository.manager.query(sql1),
            this.tagRepository.manager.query(sql2),
        ]);
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
            ORDER BY created_at DESC
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
            await manager.createQueryBuilder()
                .relation(Tag, 'followers')
                .of(tagID)
                .add(userID);
            await manager.query(`UPDATE tags SET follower_count = follower_count + 1 WHERE id = ${tagID}`);
        });
    }

    async removeFollower(tagID: number, userID: number) {
        await this.tagRepository.manager.connection.transaction(async manager => {
            await manager.createQueryBuilder()
                .relation(Tag, 'followers')
                .of(tagID)
                .remove(userID);
            await manager.query(`UPDATE tags SET follower_count = follower_count - 1 WHERE id = ${tagID}`);
        });
    }

    async tagsFilterByFollowerID(tags: number[], followerID: number) {
        if (!tags || tags.length <= 0) {
            return [];
        }
        const sql = `SELECT user_id as userID, tag_id as tagID FROM user_subscribed_tag
            WHERE user_id = ${followerID} AND tag_id IN (${tags.join(',')})`;
        return await this.tagRepository.manager.query(sql);
    }

    async isFollowed(userID: number, tagID: number): Promise<boolean> {
        const sql = `SELECT * FROM user_subscribed_tag WHERE user_id = ${userID} AND tag_id = ${tagID}`;
        const arr = await this.tagRepository.manager.query(sql);
        return arr && arr.length > 0;
    }
}