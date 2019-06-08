import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entity/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { OSSService } from '../common/oss.service';
import { ListResult } from '../entity/interface';

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

    async list(page: number, pageSize: number): Promise<ListResult> {
        const [list, count] = await this.tagRepository.findAndCount({
            select: {
                id: true,
                name: true,
                articleCount: true,
                followerCount: true,
                iconURL: true,
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

    async subscribedList(userID: number, page: number, pageSize: number): Promise<ListResult> {
        const sql1 = `SELECT tags.id as id, tags.name as name, tags.article_count as articleCount,
                tags.follower_count as followerCount, tags.icon_url as iconURL
            FROM tags, user_subscribed_tag
            WHERE user_subscribed_tag.user_id = ${userID} AND tags.id = user_subscribed_tag.tag_id
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

    async isExists(id: number): Promise<boolean> {
        const tag = await this.tagRepository.findOne({
            select: ['id'],
            where: { id },
        });
        return !!tag;
    }

    async addFollower(tagID: number, userID: number) {
        await this.tagRepository.createQueryBuilder()
            .relation(Tag, 'followers')
            .of(tagID)
            .add(userID);
    }

    async removeFollower(tagID: number, userID: number) {
        await this.tagRepository.createQueryBuilder()
            .relation(Tag, 'followers')
            .of(tagID)
            .remove(userID);
    }
}