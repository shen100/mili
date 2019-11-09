import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entity/category.entity';
import { Article } from '../entity/article.entity';
import { RedisService, cacheKeys } from '../redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly redisService: RedisService,
    ) {}

    async all(): Promise<Array<Category>> {
        let categories = await this.redisService.getCategories();
        if (!categories || categories.length <= 0) {
            categories = await this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                    pathname: true,
                    sequence: true,
                    articleCount: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            await this.redisService.setCategories(categories);
        }
        return categories;
    }

    async isExists(id: number): Promise<boolean> {
        const category = await this.categoryRepository.findOne({
            select: ['id'],
            where: { id },
        });
        return !!category;
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const category = new Category();
        category.name = createCategoryDto.name;
        category.sequence = createCategoryDto.sequence;
        category.pathname = createCategoryDto.pathname;
        category.createdAt = new Date();
        category.updatedAt = category.createdAt;
        category.articleCount = 0;
        return await this.categoryRepository.save(category);
    }

    async update(updateCategoryDto: UpdateCategoryDto) {
        return await this.categoryRepository.update({
            id: updateCategoryDto.id,
        }, {
            name: updateCategoryDto.name,
            sequence: updateCategoryDto.sequence,
            pathname: updateCategoryDto.pathname,
        });
    }

    async addFollower(collectionID: number, userID: number) {
        await this.categoryRepository.createQueryBuilder()
            .relation(Category, 'followers')
            .of(collectionID)
            .add(userID);
    }

    async removeFollower(id: number, userID: number) {
        await this.categoryRepository.createQueryBuilder()
            .relation(Category, 'followers')
            .of(id)
            .remove(userID);
    }

    async findCategoriesFilterByFollowerID(followerID: number, categories: number[]) {
        if (!categories || categories.length <= 0) {
            return [];
        }
        const sql = `SELECT user_id as followerID, category_id as categoryID FROM follower_category
            WHERE user_id = ${followerID} AND category_id IN (${categories.join(',')})`;
        return await this.categoryRepository.manager.query(sql);
    }

    // 随机返回文章
    async randomCategories(page: number, pageSize: number) {
        const [list, count] = await Promise.all([
            this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                    followerCount: true,
                    articleCount: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.categoryRepository.count(),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async searchCategories(keyword: string, page: number, pageSize: number) {
        const condition = {
            name: Like(`%${keyword}%`),
        };
        const [list, count] = await Promise.all([
            this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                    followerCount: true,
                    articleCount: true,
                    coverURL: true,
                },
                where: condition,
                skip: (page - 1) * pageSize,
                take: pageSize,
            } as any),
            this.categoryRepository.count(condition),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async searchCategoryByName(keyword: string) {
        return await this.categoryRepository.findOne({
            select: {
                id: true,
                name: true,
            },
            where: {
                name: keyword,
            },
        });
    }
}