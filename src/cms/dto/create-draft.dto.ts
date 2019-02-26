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
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { Type } from 'class-transformer';
import { ArticleConstants } from '../../config/constants';

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

    @IsEnum(ArticleContentType, {
        message: '无效的内容格式',
    })
    readonly contentType: number;

    @Validate(CustomCategory)
    readonly categories: CategoryDto[];
}