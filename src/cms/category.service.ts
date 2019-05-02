import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entity/category.entity';
import { Article } from '../entity/article.entity';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async hot(): Promise<Array<Category>> {
        const categories: Array<Category> = await this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                },
            });
        return categories;
    }

    async isExists(id: number): Promise<boolean> {
        const category = await this.categoryRepository.findOne({
            select: ['id'],
            where: { id },
        });
        return !!category;
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
                    coverURL: true,
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
                coverURL: true,
            },
            where: {
                name: keyword,
            },
        });
    }
}