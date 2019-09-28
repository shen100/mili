import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { AdminController } from './admin.controller';
import { Settings } from '../entity/settings.entity';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Settings,
        ]),
        CommonModule,
    ],
    controllers: [
        UserController,
        AdminController,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}