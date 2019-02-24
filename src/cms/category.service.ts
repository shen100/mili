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

    async searchByName(name: string) {
        let category: Category;
        let categories: Array<Category>;
        [category, categories] = await Promise.all([
            this.categoryRepository.findOne({
                select: {
                    id: true,
                    name: true,
                },
                where: { name },
            }),
            this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                },
                where: {
                    name: Like(`${name}%`),
                },
                take: 10,
            } as any),
        ]);
        categories = categories || [];
        if (!category) {
            return categories;
        }
        return _.unionWith(categories, [category], _.isEqual);
    }
}