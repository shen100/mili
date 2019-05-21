import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import * as striptags from 'striptags';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Article, ArticleStatus, ArticleContentType } from '../entity/article.entity';
import { ArticleConstants } from '../constants/constants';
import { Repository, Not, Like, In } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { MyLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { UserRole, User } from '../entity/user.entity';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../common/exception/my-http.exception';
import { ListResult } from '../entity/interface';

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
        const [ article ] = await Promise.all([
            this.articleRepository.findOne({
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
                },
                relations: ['user'],
                where: {
                    id,
                    status: Not(ArticleStatus.VerifyFail),
                },
            }),
            this.articleRepository.createQueryBuilder()
                .update()
                .set({
                    browseCount: () => 'browse_count + 1',
                })
                .where('id = :id', { id })
                .execute(),
        ]);
        article.browseCount++;
        return article;
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

    async list(page: number, pageSize: number): Promise<ListResult> {
        const [list, count] = await this.articleRepository.findAndCount({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
                likeCount: true,
                coverURL: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            },
            relations: ['user'],
            where: {
                status: Not(ArticleStatus.VerifyFail),
            },
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

    async listInCategory(categoryID: number, page: number, pageSize: number): Promise<ListResult> {
        const [list, count] = await this.articleRepository.createQueryBuilder('a')
            .select(['a.id', 'a.name', 'a.createdAt', 'a.summary', 'a.commentCount',
                'a.coverURL', 'a.likeCount', 'user.id', 'user.username', 'user.avatarURL'])
            .leftJoin('a.user', 'user')
            .leftJoin('a.categories', 'c')
            .where('a.status != :status AND c.id = :categoryID', {
                status: ArticleStatus.VerifyFail,
                categoryID,
            })
            .skip((page - 1) * pageSize).take(pageSize)
            .orderBy({'a.createdAt': 'DESC'}).getManyAndCount();
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async recommendList(page: number, pageSize: number) {
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
            },
            relations: ['user'],
            where: {
                status: Not(ArticleStatus.VerifyFail),
            },
            order: {
                id: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
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

    // 单个用户最近发表的N篇文章
    async userRecentArticles(userID: number, limit: number): Promise<Article[]> {
        return await this.userArticles(userID, 1, 3, {
            createdAt: 'DESC',
        });
    }

    // 一组用户最近发表的N篇文章
    async usersRecentArticles(users: number[], limitArticleCount: number) {
        const sql = `SELECT user.id, user.username, user.sex, user.avatar_url as avatarURL, user.introduce,
                     user.article_count as articleCount, a.id as articleID, a.name as articleTitle, a.created_at as articleCreatedAt
                     FROM users user
                     LEFT JOIN articles a ON user.id = a.user_id AND a.status != ${ArticleStatus.VerifyFail}
                     WHERE user.id in (${users.join(',')}) AND ${limitArticleCount} >
                        (SELECT COUNT(*) FROM articles b WHERE b.user_id = user.id
                            AND b.created_at > a.created_at)
                     ORDER BY articleCount DESC, articleCreatedAt DESC`;
        const list = await this.articleRepository.manager.query(sql);
        const userArr = [];
        const userMap = {};
        for (const item of list) {
            let user;
            if (!userMap[item.id]) {
                user = {
                    id: item.id,
                    username: item.username,
                    sex: item.sex,
                    avatarURL: item.avatarURL,
                    introduce: item.introduce,
                    articleCount: item.articleCount,
                };
                userMap[item.id] = user;
                userArr.push(user);
            } else {
                user = userMap[item.id];
            }
            user.updates = user.updates || [];
            if (item.articleID) {
                user.updates.push({
                    id: item.articleID,
                    name: item.articleTitle,
                    createdAt: item.articleCreatedAt,
                    updateType: 'article',
                });
            }
        }
        return userArr;
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
        if (!result.raw.affectedRows) {
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

    // 随机返回文章
    async randomArticles(page: number, pageSize: number) {
        const condition = {
            deletedAt: null,
            status: Not(ArticleStatus.VerifyFail),
        };
        const [list, count] = await Promise.all([
            this.articleRepository.find({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    summary: true,
                    commentCount: true,
                    likeCount: true,
                    user: {
                        id: true,
                        username: true,
                    },
                },
                relations: ['user'],
                where: condition,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.articleRepository.count(condition),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}