import {
    IsString,
    IsInt,
    MaxLength,
    IsEnum,
    ArrayMaxSize,
    ValidateNested,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    Validate,
    Validator,
    IsUrl,
    ValidateIf,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { Type } from 'class-transformer';
import { ArticleConstants } from '../../constants/article';

class CategoryDto {
    @IsInt({
        message: '无效的分类id',
    })
    readonly id: number;
}

@ValidatorConstraint({ name: 'customCategory', async: false })
export class CustomCategory implements ValidatorConstraintInterface {

    validate(categories: CategoryDto[], args: ValidationArguments) {
        if (categories === null || categories === undefined ) {
            return true;
        }
        if (categories.constructor !== Array) {
            return false;
        }
        if (categories.length > ArticleConstants.MAX_CATEGORY_COUNT) {
            return false;
        }
        const validator = new Validator();
        for (const category of categories) {
            if (!validator.isInt(category.id)) {
                return false;
            }
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return `无效的分类 或 超过${ArticleConstants.MAX_CATEGORY_COUNT}个分类`;
    }
}

class TagDto {
    @IsInt({
        message: '无效的标签id',
    })
    readonly id: number;
}

@ValidatorConstraint({ name: 'customTag', async: false })
export class CustomTag implements ValidatorConstraintInterface {

    validate(tags: TagDto[], args: ValidationArguments) {
        if (tags === null || tags === undefined ) {
            return true;
        }
        if (tags.constructor !== Array) {
            return false;
        }
        if (tags.length > ArticleConstants.MAX_TAG_COUNT) {
            return false;
        }
        const validator = new Validator();
        for (const tag of tags) {
            if (!validator.isInt(tag.id)) {
                return false;
            }
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return `无效的标签 或 超过${ArticleConstants.MAX_TAG_COUNT}个标签`;
    }
}

export class CreateDraftDto {
    @MaxLength(100, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @MaxLength(10000, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;

    // 传了coverURL字段的话，才对coverURL进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.coverURL !== 'undefined';
    })
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly coverURL: string;

    @IsEnum(ArticleContentType, {
        message: '无效的内容格式',
    })
    readonly contentType: number;

    @Validate(CustomCategory)
    readonly categories: CategoryDto[];

    @Validate(CustomTag)
    readonly tags: TagDto[];
}