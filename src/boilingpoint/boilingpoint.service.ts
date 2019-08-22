import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import * as striptags from 'striptags';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Article, ArticleStatus, ArticleContentType } from '../entity/article.entity';
import { ArticleConstants } from '../constants/constants';
import { Repository, Not, Like, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { MyLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { UserRole, User } from '../entity/user.entity';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ListResult } from '../entity/interface';
import { Tag } from '../entity/tag.entity';
import { BoilingPointTopic, BoilingPoint } from '../entity/boilingpoint.entity';

@Injectable()
export class BoilingPointService {
    constructor(
        @InjectRepository(BoilingPoint)
        private readonly boilingPointRepository: Repository<BoilingPoint>,
    ) {}
}
