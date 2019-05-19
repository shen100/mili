import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandBook } from '../entity/handbook.entity';
import { CreateHandBookDto } from './dto/create-handbook.dto';

@Injectable()
export class HandBookService {
    constructor(
        @InjectRepository(HandBook)
        private readonly handBookRepository: Repository<HandBook>,
    ) {}

    async create(createHandBookDto: CreateHandBookDto, userID: number) {
        const handBook = new HandBook();
        handBook.name = createHandBookDto.name;
        handBook.saleCount = 0;
        handBook.coverURL = createHandBookDto.coverURL || '';
        handBook.userID = userID;
        handBook.createdAt = new Date();
        handBook.updatedAt = handBook.createdAt;
        return await this.handBookRepository.save(handBook);
    }
}