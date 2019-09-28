import {
    IsUrl,
} from 'class-validator';

export class UpdateAvatarDto {
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly avatarURL: string;
}