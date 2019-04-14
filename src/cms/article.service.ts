import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import * as striptags from 'striptags';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Article, ArticleStatus, ArticleContentType } from '../entity/article.entity';
import { ArticleConstants } from '../config/constants';
import { Repository, Not, Like } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { MyLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { UserRole, User } from '../entity/user.entity';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly logger: MyLoggerService,
        private readonly configService: ConfigService,
    ) {}

    async isExist(id: number) {
        const article = await this.articleRepository.findOne({
            id,
        }, {
            select: ['id'],
        });
        return article !== null;
    }

    async detail(id: number) {
        return await this.articleRepository.findOne({
            select: {
                id: true,
                name: true,
                coverURL: true,
                createdAt: true,
                wordCount: true,
                browseCount: true,
                commentCount: true,
                likeCount: true,
                summary: true,
                htmlContent: true,
                commentEnabled: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                    wordCount: true,
                    followerCount: true,
                    likeCount: true,
                    introduce: true,
                },
            } as any,
            relations: ['user'],
            where: {
                id,
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
        });
    }

    async detailForEditor(id: number) {
        return await this.articleRepository.findOne({
            select: {
                id: true,
                name: true,
                createdAt: true,
                wordCount: true,
                browseCount: true,
                commentCount: true,
                likeCount: true,
                contentType: true,
                summary: true,
                content: true,
                htmlContent: true,
            },
            relations: ['categories'],
            where: {
                id,
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
        });
    }

    async list(page: number) {
        return await this.articleRepository.find({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
                user: {
                    id: true,
                    username: true,
                },
            } as any,
            relations: ['user'],
            where: {
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * 20,
            take: 20,
        });
    }

    async recommendList(page: number) {
        return await this.articleRepository.find({
            select: {
                id: true,
                name: true,
                summary: true,
                coverURL: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            } as any,
            relations: ['user'],
            where: {
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * 20,
            take: 20,
        });
    }

    async userArticles(userID: number, page: number, pageSize: number, order) {
        return await this.articleRepository.find({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
            } as any,
            where: {
                userID,
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            order,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async userArticlesByLike(userID: number, keyword: string, page: number, pageSize: number): Promise<Article[]> {
        return await this.articleRepository.find({
            select: ['id', 'name', 'createdAt', 'summary', 'commentCount'],
            where: {
                userID,
                name: Like(`%${keyword}%`),
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async userArticlesSortByCreatedAt(userID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.userArticles(userID, page, pageSize, {
            createdAt: 'DESC',
        });
    }

    async userArticlesSortByHot(userID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.userArticles(userID, page, pageSize, {
            hot: 'DESC',
        });
    }

    async userArticlesSortByCommentCount(userID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.userArticles(userID, page, pageSize, {
            commentCount: 'DESC',
        });
    }

    async collectionArticlesSortByCommentCount(collectionID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.userArticles(collectionID, page, pageSize, {
            commentCount: 'DESC',
        });
    }

    async threeRecentArticles(userID: number): Promise<Article[]> {
        return await this.userArticles(userID, 1, 3, {
            createdAt: 'DESC',
        });
    }

    async create(createArticleDto: CreateArticleDto, userID: number) {
        const uniqCates = _.uniqBy(createArticleDto.categories, (c) => c.id);
        const categories: Category[] = uniqCates.map(cate => {
            const c = new Category();
            c.id = cate.id;
            return c;
        });
        const article = new Article();
        article.name = createArticleDto.name;
        article.categories = categories;
        article.collectCount = 0;
        article.commentCount = 0;
        article.browseCount = 0;
        article.contentType = createArticleDto.contentType;
        if (createArticleDto.coverURL) {
            article.coverURL = createArticleDto.coverURL;
        }
        if (article.contentType === ArticleContentType.Markdown) {
            article.content = createArticleDto.content;
            article.htmlContent = marked(createArticleDto.content);
        } else {
            article.htmlContent = createArticleDto.content;
        }
        let summary = striptags(article.htmlContent);
        summary = summary.replace(/^\s+|\s+$/g, '');
        summary = summary.replace(/\s+|\n$/g, ' ');
        article.wordCount = summary.length;
        summary = summary.substr(0, ArticleConstants.SUMMARY_LENGTH);
        article.summary = summary;
        article.status = ArticleStatus.Verifying;
        article.userID = userID;
        article.commentEnabled = true;
        article.createdAt = new Date();
        article.updatedAt = article.createdAt;

        try {
            return await this.articleRepository.save(article);
        } catch (err) {
            this.logger.error(err, '');
            throw new HttpException({
                errNo: ErrorCode.ParamsError,
                message: '无效的分类',
            }, HttpStatus.OK);
        }
    }

    async update(updateArticleDto: UpdateArticleDto, userID: number) {
        const uniqCates = _.uniqBy(updateArticleDto.categories, (c) => c.id);
        const categories: Category[] = uniqCates.map(cate => {
            const c = new Category();
            c.id = cate.id;
            return c;
        });
        const newArticle = new Article();
        newArticle.id = updateArticleDto.id;
        newArticle.name = updateArticleDto.name;
        newArticle.categories = categories;
        if (updateArticleDto.coverURL) {
            newArticle.coverURL = updateArticleDto.coverURL;
        }
        if (updateArticleDto.contentType === ArticleContentType.Markdown) {
            newArticle.content = updateArticleDto.content;
        } else {
            newArticle.htmlContent = updateArticleDto.content;
        }

        const article: Article = await this.articleRepository.findOne({
            select: [
                'id', 'userID',
            ],
            where: { id: updateArticleDto.id },
        });

        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的id',
            });
        }

        if (article.userID !== userID) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        try {
            return await this.articleRepository.save(newArticle);
        } catch (err) {
            this.logger.error(err, '');
            throw new HttpException({
                errorCode: ErrorCode.ParamsError,
                msg: '无效的分类',
            }, HttpStatus.OK);
        }
    }

    async allVerifyFail(userID: number) {
        try {
            const user: User = await this.userRepository.findOne({
                select: [
                    'id', 'role',
                ],
                where: { id: userID },
            });

            if (user.role !== UserRole.Normal) {
                throw new MyHttpException({
                    errorCode: ErrorCode.Forbidden.CODE,
                });
            }

            return await this.articleRepository.update({
                userID,
            }, {
                status: ArticleStatus.VerifyFail,
            });
        } catch (err) {
            this.logger.error(err, '');
            throw new HttpException({
                errorCode: ErrorCode.ERROR,
            }, HttpStatus.OK);
        }
    }

    async closeOrOpenComment(id: number, userID: number, commentEnabled: boolean) {
        commentEnabled = !!commentEnabled;
        const result = await this.articleRepository.update({
            id,
            userID,
        }, {
            commentEnabled,
        });
        if (!result.raw.changedRows) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
    }

    async likeOrCancelLike(articleID: number, userID: number) {
        const sql = `DELETE FROM userlikearticles
                WHERE article_id = ${articleID} AND user_id = ${userID}`;
        const sql2 = `UPDATE articles SET like_count = like_count - 1 WHERE id = ${articleID}`;

        const sql3 = `INSERT INTO userlikearticles (user_id, article_id, created_at)
                VALUES (${userID}, ${articleID}, "${moment(new Date()).format('YYYY.MM.DD HH:mm:ss')}")`;
        const sql4 = `UPDATE articles SET like_count = like_count + 1 WHERE id = ${articleID}`;

        const userLiked = await this.isUserLiked(articleID, userID);

        await this.articleRepository.manager.connection.transaction(async manager => {
            if (userLiked) {
                await manager.query(sql);
                await manager.query(sql2);
                return;
            }
            await manager.query(sql3);
            await manager.query(sql4);
        });
    }

    async isUserLiked(articleID: number, userID: number): Promise<boolean> {
        const sql = `SELECT article_id, user_id FROM userlikearticles
            WHERE article_id = ${articleID} AND user_id = ${userID}`;
        let result = await this.articleRepository.manager.query(sql);
        result = result || [];
        if (result.length) {
            return true;
        }
        return false;
    }
}