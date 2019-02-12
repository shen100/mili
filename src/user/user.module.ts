import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { AdminController } from './admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [
        UserController,
        AdminController,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}