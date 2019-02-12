import {
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '../entity/collection.entity';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { MyLoggerService } from '../logger/logger.service';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CollectionStatus } from '../entity/collection.entity';
import { ErrorCode } from '../config/constants';
import { User, Follower } from '../entity/user.entity';

@Injectable()
export class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly logger: MyLoggerService,
    ) {}

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
            status = ${CollectionStatus.Collected}`;
        const result = await this.collectionRepository.manager.query(sql);
        return parseInt(result[0].count, 10) || 0;
    }

    async collectArticle(collectionID: number, articleID: number, status: number): Promise<boolean> {
        const sql = `INSERT INTO article_collection (collection_id, article_id, status) VALUES (${collectionID}, ${articleID}, ${status})`;
        return await this.collectionRepository.manager.query(sql);
    }

    async removeArticle(collectionID: number, articleID: number): Promise<boolean> {
        const sql = `DELETE FROM article_collection WHERE collection_id = ${collectionID} AND article_id = ${articleID}`;
        return await this.collectionRepository.manager.query(sql);
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
}