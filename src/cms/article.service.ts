import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import * as striptags from 'striptags';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Article, ArticleStatus, ArticleContentType } from '../entity/article.entity';
import { Repository, Not, Like, In } from 'typeorm';
import { EditArticleDto } from './dto/edit-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { ConfigService } from '../config/config.service';
import { UserRole, User } from '../entity/user.entity';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ListResult } from '../entity/listresult.entity';
import { Tag } from '../entity/tag.entity';
import { MyLoggerService } from '../common/logger.service';
import { ArticleConstants } from '../constants/article';

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

    async isExist(id: number): Promise<boolean> {
        const article = await this.articleRepository.findOne({
            id,
        }, {
            select: ['id'],
        });
        return article !== null;
    }

    async detail(id: number) {
        const article = await this.articleRepository.findOne({
            select: {
                id: true,
                name: true,
                coverURL: true,
                createdAt: true,
                wordCount: true,
                browseCount: true,
                commentCount: true,
                rootCommentCount: true,
                likedCount: true,
                summary: true,
                htmlContent: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                    wordCount: true,
                    job: true,
                    company: true,
                    articleCount: true,
                    articleViewCount: true,
                    followerCount: true,
                    likedCount: true,
                    introduce: true,
                },
                userID: true,
            },
            relations: ['user', 'tags'],
            where: {
                id,
                status: Not(ArticleStatus.VerifyFail),
            },
        });
        return article;
    }

    async incArticleViewCount(articleID: number, authorID: number) {
        await Promise.all([
            this.articleRepository.createQueryBuilder()
                    .update()
                    .set({
                        browseCount: () => 'browse_count + 1',
                    })
                    .where('id = :id', { id: articleID })
                    .execute(),
            this.userRepository.createQueryBuilder()
                    .update()
                    .set({
                        articleViewCount: () => 'article_view_count + 1',
                    })
                    .where('id = :id', { id: authorID })
                    .execute(),
        ]);
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
                likedCount: true,
                contentType: true,
                summary: true,
                content: true,
                htmlContent: true,
            },
            relations: ['categories', 'tags'],
            where: {
                id,
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
        });
    }

    async list(sort: string, order: 'DESC' | 'ASC', page: number, pageSize: number): Promise<ListResult<Article>> {
        const [list, count] = await this.articleRepository.findAndCount({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
                likedCount: true,
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
                [sort]: order,
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

    /**
     * 用户点过赞的文章
     */
    async userLikeArticles(userID: number, page: number, pageSize: number): Promise<ListResult<Article>> {
        const sql = `SELECT articles.id as id, articles.name as name, articles.created_at as createdAt, articles.summary as summary,
                articles.comment_count as commentCount, articles.liked_count as likedCount, articles.cover_url as coverURL
            FROM like_articles, articles
            WHERE like_articles.user_id = ? AND articles.id = like_articles.article_id 
            ORDER BY like_articles.created_at DESC LIMIT ?, ?`;
        const sql2 = `SELECT COUNT(*) as count FROM like_articles WHERE user_id = ?`;
        const [articles, countResult] = await Promise.all([
            this.articleRepository.manager.query(sql, [userID, (page - 1) * pageSize, pageSize]),
            this.articleRepository.manager.query(sql2, [userID]),
        ]);
        return {
            count: parseInt(countResult[0].count, 10),
            list: articles,
            page,
            pageSize,
        };
    }

    async listInCategory(categoryID: number, sort: string, order: 'DESC' | 'ASC', page: number, pageSize: number): Promise<ListResult<Article>> {
        const [list, count] = await this.articleRepository.createQueryBuilder('a')
            .select(['a.id', 'a.name', 'a.createdAt', 'a.summary', 'a.commentCount',
                'a.coverURL', 'a.likedCount', 'user.id', 'user.username', 'user.avatarURL'])
            .leftJoin('a.user', 'user')
            .leftJoin('a.categories', 'c')
            .where('a.status != :status AND c.id = :categoryID', {
                status: ArticleStatus.VerifyFail,
                categoryID,
            })
            .orderBy(sort, order)
            .skip((page - 1) * pageSize).take(pageSize)
            .orderBy({'a.createdAt': 'DESC'}).getManyAndCount();
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async listInTag(tagID: number, page: number, pageSize: number, order: string): Promise<ListResult<Article>> {
        let orderStr = '';
        if (order === 'new') {
            orderStr = 'a.createdAt';
        } else {
            orderStr = 'a.browseCount';
        }
        const [list, count] = await this.articleRepository.createQueryBuilder('a')
            .select(['a.id', 'a.name', 'a.createdAt', 'a.summary', 'a.commentCount', 'a.browseCount',
                'a.coverURL', 'a.likedCount', 'user.id', 'user.username', 'user.avatarURL'])
            .leftJoin('a.user', 'user')
            .leftJoin('a.tags', 't')
            .where('a.status != :status AND t.id = :tagID', {
                status: ArticleStatus.VerifyFail,
                tagID,
            })
            .skip((page - 1) * pageSize).take(pageSize)
            .orderBy({[orderStr]: 'DESC'}).getManyAndCount();
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    /**
     * 推荐的文章
     */
    async recommendList(page: number, pageSize: number, sort: string): Promise<ListResult<Article>> {
        const sortMap = {
            popular: { hot: 'DESC'},
            newest: { id: 'DESC'},
            noreply: { commentCount: 'ASC', id: 'DESC' },
        };
        const [list, count] = await this.articleRepository.findAndCount({
            select: {
                id: true,
                name: true,
                summary: true,
                coverURL: true,
                createdAt: true,
                updatedAt: true,
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
            order: sortMap[sort],
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
     * 相关推荐
     */
    async relativeRecommendList(page: number, pageSize: number): Promise<ListResult<Article>> {
        const [list, count] = await this.articleRepository.findAndCount({
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
            order: { id: 'DESC'},
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
     * 用户的文章
     */
    async userArticles(userID: number, sort: string, order: 'DESC' | 'ASC', page: number, pageSize: number): Promise<ListResult<Article>> {
        const [list, count] = await this.articleRepository.findAndCount({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
                likedCount: true,
                coverURL: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            },
            relations: ['user'],
            where: {
                userID,
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            order: {
                [sort]: order,
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

    async oldUserArticles(userID: number, page: number, pageSize: number, order) {
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
        return await this.oldUserArticles(userID, page, pageSize, {
            createdAt: 'DESC',
        });
    }

    async userArticlesSortByHot(userID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.oldUserArticles(userID, page, pageSize, {
            hot: 'DESC',
        });
    }

    async userArticlesSortByCommentCount(userID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.oldUserArticles(userID, page, pageSize, {
            commentCount: 'DESC',
        });
    }

    async collectionArticlesSortByCommentCount(collectionID: number, page: number, pageSize: number): Promise<Article[]> {
        return await this.oldUserArticles(collectionID, page, pageSize, {
            commentCount: 'DESC',
        });
    }

    // 单个用户最近发表的N篇文章
    async userRecentArticles(userID: number, limit: number): Promise<Article[]> {
        return await this.oldUserArticles(userID, 1, 3, {
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

    private htmlToSummary(htmlContent: string) {
        let summary = striptags(htmlContent);
        summary = summary.replace(/^\s+|\s+$/g, '');
        summary = summary.replace(/\s+|\n$/g, ' ');
        const wordCount = summary.length;
        summary = summary.substr(0, ArticleConstants.SUMMARY_LENGTH);
        return { summary, wordCount };
    }

    async create(createArticleDto: EditArticleDto, userID: number) {
        const tagIDs = _.uniq(createArticleDto.tags);
        const tags: Tag[] = tagIDs.map(tagID => {
            const tag = new Tag();
            tag.id = tagID;
            return tag;
        });

        const categoryIDs = [];
        const tagCategorySQL = 'SELECT category_id FROM tag_category WHERE tag_id IN (?)';
        const cates = await this.articleRepository.manager.query(tagCategorySQL, [tagIDs.join(',')]);
        const categories: Category[] = cates.map(cate => {
            const c = new Category();
            c.id = cate.category_id;
            categoryIDs.push(cate.category_id);
            return c;
        });

        const article = new Article();
        article.name = createArticleDto.name;
        article.categories = categories;
        article.tags = tags;
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
        const { wordCount, summary } = this.htmlToSummary(article.htmlContent);
        article.wordCount = wordCount;
        article.summary = summary;
        article.status = ArticleStatus.Verifying;
        article.userID = userID;
        article.createdAt = new Date();
        article.updatedAt = article.createdAt;

        try {
            let articleResult;
            await this.articleRepository.manager.connection.transaction(async manager => {
                articleResult = await manager.getRepository(Article).save(article);
                await manager.query('UPDATE users SET article_count = article_count + 1 WHERE id = ?', [userID]);
                await manager.query(`UPDATE categories SET article_count = article_count + 1 WHERE id IN (${categoryIDs.join(',')})`);
                await manager.query(`UPDATE tags SET article_count = article_count + 1 WHERE id IN (${tagIDs.join(',')})`);
            });
            return articleResult;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException({
                errNo: ErrorCode.ParamsError,
                message: '无效的分类',
            }, HttpStatus.OK);
        }
    }

    async update(editArticleDto: EditArticleDto, articleID: number, userID: number) {
        const insertCategories = [];
        const categoryIDs = [];
        const insertTags = [];
        const tagIDs = _.uniq(editArticleDto.tags);
        tagIDs.map(tagID => {
            insertTags.push(`(${articleID}, ${tagID})`);
        });

        const tagCategorySQL = 'SELECT category_id FROM tag_category WHERE tag_id IN (?)';
        const cates = await this.articleRepository.manager.query(tagCategorySQL, [tagIDs.join(',')]);
        cates.map(c => {
            categoryIDs.push(c.category_id);
            insertCategories.push(`(${articleID}, ${c.category_id})`);
        });

        const article: Article = await this.articleRepository.createQueryBuilder('a')
            .select(['a.id', 'a.userID', 't.id', 'c.id'])
            .leftJoin('a.tags', 't')
            .leftJoin('a.categories', 'c')
            .where({ id: articleID })
            .getOne();

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
        const updateData = {
            name: editArticleDto.name,
            contentType: ArticleContentType.Markdown,
            coverURL: editArticleDto.coverURL || '',
            content: '',
            htmlContent: '',
            summary: '',
            wordCount: 0,
        };

        updateData.contentType = editArticleDto.contentType;
        if (editArticleDto.contentType === ArticleContentType.Markdown) {
            updateData.content = editArticleDto.content;
            updateData.htmlContent = marked(editArticleDto.content);
        } else {
            updateData.htmlContent = editArticleDto.content;
        }

        const { wordCount, summary } = this.htmlToSummary(article.htmlContent);

        updateData.wordCount = wordCount;
        updateData.summary = summary;

        const oldCategoryIDs = article.categories.map(c => c.id);
        const oldTagIDs = article.tags.map(t => t.id);
        await this.articleRepository.manager.connection.transaction(async manager => {
            await manager.update(Article, {
                id: article.id,
            }, updateData);
            await manager.query(`DELETE FROM article_category WHERE article_id = ${article.id}`);
            await manager.query(`DELETE FROM article_tag WHERE article_id = ${article.id}`);
            await manager.query(`UPDATE categories SET article_count = article_count - 1 WHERE id IN (${oldCategoryIDs.join(',')})`);
            if (oldTagIDs.length) {
                await manager.query(`UPDATE tags SET article_count = article_count - 1 WHERE id IN (${oldTagIDs.join(',')})`);
            }
            await manager.query(`UPDATE categories SET article_count = article_count + 1 WHERE id IN (${categoryIDs.join(',')})`);
            await manager.query(`UPDATE tags SET article_count = article_count + 1 WHERE id IN (${tagIDs.join(',')})`);
            await manager.query(`INSERT INTO article_category (article_id, category_id) VALUES ${insertCategories.join(',')}`);
            await manager.query(`INSERT INTO article_tag (article_id, tag_id) VALUES ${insertTags.join(',')}`);
        });
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
            this.logger.error(err);
            throw new HttpException({
                errorCode: ErrorCode.ERROR,
            }, HttpStatus.OK);
        }
    }

    async likeOrCancelLike(articleID: number, userID: number) {
        const [ userLiked, article ] = await Promise.all([
            this.isUserLiked(articleID, userID),
            this.articleRepository.findOne({
                select: ['id', 'userID'],
                where: { id: articleID },
            }),
        ]);

        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        await this.articleRepository.manager.connection.transaction(async manager => {
            if (userLiked) {
                const cancelSQL1 = `DELETE FROM like_articles WHERE article_id = ? AND user_id = ?`;
                const cancelSQL2 = `UPDATE articles SET liked_count = liked_count - 1 WHERE id = ?`;
                const cancelSQL3 = `UPDATE users SET liked_count = liked_count - 1 WHERE id = ?`;
                await manager.query(cancelSQL1, [ articleID, userID ]);
                await manager.query(cancelSQL2, [ articleID ]);
                await manager.query(cancelSQL3, [ article.userID ]);
                return;
            }
            const sql1 = `INSERT INTO like_articles (user_id, article_id, publisher, created_at) VALUES (?, ?, ?, ?)`;
            const sql2 = `UPDATE articles SET liked_count = liked_count + 1 WHERE id = ${articleID}`;
            const sql3 = `UPDATE users SET liked_count = liked_count + 1 WHERE id = ?`;
            await manager.query(sql1, [ userID, articleID, article.userID, new Date() ]);
            await manager.query(sql2, [ articleID ]);
            await manager.query(sql3, [ article.userID ]);
        });
    }

    async isUserLiked(articleID: number, userID: number): Promise<boolean> {
        const sql = `SELECT article_id, user_id FROM like_articles
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
                    likedCount: true,
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

    async deleteArticle(id: number, userID: number) {
        const article: Article = await this.articleRepository.createQueryBuilder('a')
            .select(['a.id', 'a.userID', 't.id', 'c.id'])
            .leftJoin('a.tags', 't')
            .leftJoin('a.categories', 'c')
            .where({ id })
            .getOne();

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

        const oldCategoryIDs = article.categories.map(c => c.id);
        const oldTagIDs = article.tags.map(t => t.id);

        await this.articleRepository.manager.connection.transaction(async manager => {
            await manager.delete(Article, {
                id,
                userID,
            });

            await manager.query('DELETE FROM article_category WHERE article_id = ?', [id]);
            await manager.query('DELETE FROM article_tag WHERE article_id = ?', [id]);
            await manager.query('UPDATE categories SET article_count = article_count - 1 WHERE id IN (?)', [oldCategoryIDs.join(',')]);
            if (oldTagIDs.length) {
                await manager.query('UPDATE tags SET article_count = article_count - 1 WHERE id IN (?)', [oldTagIDs.join(',')]);
            }
            await manager.query('UPDATE users SET article_count = article_count - 1 WHERE id = ?', [userID]);
        });
    }
}