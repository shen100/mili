import {
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '../entity/collection.entity';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ArticleCollectionStatus } from '../entity/collection.entity';
import { ErrorCode } from '../constants/error';
import { User, Follower } from '../entity/user.entity';
import { PostMsg } from '../entity/postmsg.entity';
import { MyLoggerService } from '../common/logger.service';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly logger: MyLoggerService,
    ) {}

    // 不用的用户，推荐不同的专题, 且推荐的专题中，不包括自己创建或管理的专题
    async recommends(userID: number) {
        return await this.collectionRepository.find({
            select: {
                id: true,
                name: true,
                coverURL: true,
                articleCount: true,
                followerCount: true,
            },
            take: 20,
        });
    }

    async create(createCollectionDto: CreateCollectionDto, userID: number) {
        const collection = new Collection();
        collection.creatorID = userID;
        collection.name = createCollectionDto.name;
        collection.coverURL = createCollectionDto.coverURL;
        collection.announcement = createCollectionDto.announcement;
        collection.allowPost = createCollectionDto.allowPost;
        collection.postMustAudit = createCollectionDto.postMustAudit;
        collection.admins = createCollectionDto.admins.map(id => {
            const u = new User();
            u.id = id;
            return u;
        });
        return await this.collectionRepository.save(collection);
    }

    async updateOne(createCollectionDto: CreateCollectionDto, id: number, userID: number) {
        const collection: Collection = await this.collectionRepository.findOne({
            select: ['id', 'name', 'coverURL', 'announcement', 'allowPost', 'postMustAudit', 'creatorID'],
            where: { id },
        });

        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (collection.creatorID !== userID) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        collection.name = createCollectionDto.name;
        collection.coverURL = createCollectionDto.coverURL;
        collection.announcement = createCollectionDto.announcement;
        collection.allowPost = createCollectionDto.allowPost;
        collection.postMustAudit = createCollectionDto.postMustAudit;
        collection.admins = createCollectionDto.admins.map(uid => {
            const u = new User();
            u.id = uid;
            return u;
        });
        return await this.collectionRepository.save(collection);
    }

    async findById(id: number): Promise<Collection> {
        return await this.collectionRepository.createQueryBuilder('c')
            .select(['c.id', 'c.name', 'c.coverURL', 'c.announcement', 'c.allowPost',
                'c.postMustAudit', 'c.creatorID', 'user.id', 'user.username', 'user.avatarURL'])
            .leftJoin('c.admins', 'user')
            .where('c.id = :id', { id })
            .getOne();
    }

    async articleCount(collectionID: number): Promise<number> {
        const sql = `SELECT COUNT(*) as count FROM article_collection WHERE collection_id = ${collectionID} AND
            status = ${ArticleCollectionStatus.Collected}`;
        const result = await this.collectionRepository.manager.query(sql);
        return parseInt(result[0].count, 10) || 0;
    }

    // 向专题投稿
    async addArticle(userID: number, collection: Collection, articleID: number, status: number) {
        await this.collectionRepository.manager.connection.transaction(async manager => {
            // article_collection 中存在相同的记录的话，就更新 status 字段， 还可以在article_collection表中增加投稿时间字段，审核时间字段
            // contributor_collection 中存在相同的记录的话，更新date字段（目前表中还无date字段）
            const sql2 = `INSERT INTO article_collection (collection_id, article_id, status) VALUES (${collection.id}, ${articleID}, ${status})`;
            const sql3 = `INSERT INTO contributor_collection (collection_id, user_id) VALUES (${collection.id}, ${userID})
                            ON DUPLICATE KEY UPDATE user_id = ${userID}`;
            await manager.query(sql2);
            await manager.query(sql3);
            if (status === ArticleCollectionStatus.Auditing) {
                const postMsg = new PostMsg();
                postMsg.authorID = userID;
                postMsg.userID = collection.creatorID;
                postMsg.articleID = articleID;
                postMsg.collectionID = collection.id;
                postMsg.status = ArticleCollectionStatus.Auditing;
                postMsg.createdAt = new Date();
                await manager.save(postMsg);
            }
        });
    }

    async removeArticle(collectionID: number, articleID: number): Promise<boolean> {
        const sql = `DELETE FROM article_collection WHERE collection_id = ${collectionID} AND article_id = ${articleID}`;
        return await this.collectionRepository.manager.query(sql);
    }

    // 向专题投稿
    async receiveArticle(collectionID: number, articleID: number, messageID: number, status: number) {
        await this.collectionRepository.manager.connection.transaction(async manager => {
            const sql = `UPDATE article_collection SET status = ${status}
            WHERE collection_id = ${collectionID} AND article_id = ${articleID}`;

            const sql2 = `UPDATE post_message SET status = ${status}
                WHERE id = ${messageID}`;
            await manager.query(sql);
            await manager.query(sql2);
        });
    }

    async articlesStatusInCollection(collectionID: number, articleIDs: number[]): Promise<Array<any>> {
        const sql = `SELECT * FROM article_collection WHERE collection_id = ${collectionID} AND article_id IN (${articleIDs.join(',')})`;
        return await this.collectionRepository.manager.query(sql);
    }

    async deleteCollection(id: number) {
        await this.collectionRepository.manager.connection.transaction(async manager => {
            await manager.createQueryBuilder()
                .delete()
                .from('article_collection')
                .where('collection_id = :id', { id })
                .execute();

            await manager.createQueryBuilder()
                .delete()
                .from('user_collection')
                .where('collection_id = :id', { id })
                .execute();

            await manager.createQueryBuilder()
                .delete()
                .from(Collection)
                .where('id = :id', { id })
                .execute();
        });
    }

    async addFollower(collectionID: number, userID: number) {
        await this.collectionRepository.createQueryBuilder()
            .relation(Collection, 'followers')
            .of(collectionID)
            .add(userID);
    }

    async removeFollower(id: number, userID: number) {
        await this.collectionRepository.createQueryBuilder()
            .relation(Collection, 'followers')
            .of(id)
            .remove(userID);
    }

    async isFollowed(userID: number, collectionID): Promise<boolean> {
        const sql = `SELECT * FROM follower_collection WHERE user_id = ${userID} AND collection_id = ${collectionID}`;
        const arr = await this.collectionRepository.manager.query(sql);
        return arr && arr.length > 0;
    }

    async getFollowers(collectionID: number, page: number): Promise<Follower[]> {
        const limit: number = 20;
        const offset: number = (page - 1) * limit;
        const sql = `SELECT user.id as id, user.username as username,
                user.avatar_url as avatarURL, fc.date as date
            FROM users user, follower_collection fc
            WHERE user.id = fc.user_id AND fc.collection_id = ${collectionID}
            LIMIT ${offset}, ${limit}`;
        const results = await this.collectionRepository.manager.query(sql);
        return results.map(data => {
            return new Follower(data.id, data.username, data.avatarURL, data.date);
        });
    }

    // 最近投稿的专题, 不包括自己创建或管理的专题
    async contributeCollections(userID: number, page: number): Promise<Collection[]> {
        const limit: number = 20;
        const offset: number = (page - 1) * limit;
        const sql = `SELECT collection.id as id, collection.name as name,
                collection.cover_url as coverURL
            FROM collections collection, contributor_collection cc
            WHERE collection.id = cc.collection_id AND cc.user_id = ${userID}
            LIMIT ${offset}, ${limit}`;
        const results = await this.collectionRepository.manager.query(sql);
        return results.map(data => {
            const collection = new Collection();
            collection.id = data.id;
            collection.name = data.name;
            collection.coverURL = data.coverURL;
            return collection;
        });
    }

    // 创建/管理的专题
    async createOrMangeCollections(userID: number, page: number): Promise<Collection[]> {
        const limit: number = 20;
        const offset: number = (page - 1) * limit;
        const sql = `SELECT collection.id as id, collection.name as name,
                collection.cover_url as coverURL
            FROM collections collection, user_collection uc
            WHERE collection.id = uc.collection_id AND uc.user_id = ${userID}
            LIMIT ${offset}, ${limit}`;
        const results = await this.collectionRepository.manager.query(sql);
        return results.map(data => {
            const collection = new Collection();
            collection.id = data.id;
            collection.name = data.name;
            collection.coverURL = data.coverURL;
            return collection;
        });
    }

    async searchByPublish(name: string, userID: number): Promise<Collection[]> {
        // 和name做匹配，找出不是自己创建或管理的专题
        // 自己创建或管理的专题会在 user_collection 表中插入一条记录
        const limit: number = 20;
        const offset: number = 0;
        const sql = `SELECT DISTINCT(collection.id) as id, collection.name as name,
                collection.cover_url as coverURL
            FROM collections collection, user_collection uc
            WHERE collection.id = uc.collection_id AND uc.user_id != ${userID}
            AND collection.creator_id != ${userID}
            LIMIT ${offset}, ${limit}`;
        const results = await this.collectionRepository.manager.query(sql);
        return results.map(data => {
            const collection = new Collection();
            collection.id = data.id;
            collection.name = data.name;
            collection.coverURL = data.coverURL;
            return collection;
        });
    }
}