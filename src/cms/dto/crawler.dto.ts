import {
    IsEnum,
    IsUrl,
    MinLength,
    MaxLength,
    IsString,
    ValidateIf,
    IsNotEmpty,
} from 'class-validator';
import { CrawlerArticleFrom, CrawlerPageType } from '../../entity/crawler.entity';
import { CrawlerConstants } from '../../constants/article';

export class CrawlerDto {
    @IsUrl({
        protocols: ['https', 'http'],
        require_protocol: true,
    }, {
        message: '无效的URL',
    })
    readonly url: string;

    @ValidateIf(obj => obj.pageType === CrawlerPageType.List && obj.from === CrawlerArticleFrom.ArticleFromSegmentJuejin)
    @IsNotEmpty()
    readonly postData: string;

    @IsEnum(CrawlerArticleFrom, {
        message: '无效的来源',
    })
    readonly from: number;

    @ValidateIf(obj => {
        return obj.from !== CrawlerArticleFrom.ArticleFromNULL;
    })
    @IsEnum(CrawlerPageType, {
        message: '无效的页面类型',
    })
    readonly pageType: string;

    @ValidateIf(obj => {
        return obj.pageType === CrawlerPageType.List;
    })
    @MinLength(CrawlerConstants.SELECTOR_MIN_LENGTH, {
        message: '无效的列表项选择器',
    })
    @MaxLength(CrawlerConstants.SELECTOR_MAX_LENGTH, {
        message: '无效的列表项选择器',
    })
    @IsString()
    readonly itemSelector: string;

    @ValidateIf(obj => {
        return obj.pageType === CrawlerPageType.List;
    })
    @MinLength(CrawlerConstants.SELECTOR_MIN_LENGTH, {
        message: '无效的列表项标题选择器',
    })
    @MaxLength(CrawlerConstants.SELECTOR_MAX_LENGTH, {
        message: '无效的列表项标题选择器',
    })
    @IsString()
    readonly itemTitleSelector: string;

    @ValidateIf(obj => {
        return obj.from !== CrawlerArticleFrom.ArticleFromNULL;
    })
    @MinLength(CrawlerConstants.SELECTOR_MIN_LENGTH, {
        message: '无效的标题选择器',
    })
    @MaxLength(CrawlerConstants.SELECTOR_MAX_LENGTH, {
        message: '无效的标题选择器',
    })
    @IsString()
    readonly titleSelector: string;

    @MinLength(CrawlerConstants.SELECTOR_MIN_LENGTH, {
        message: '无效的正文选择器',
    })
    @MaxLength(CrawlerConstants.SELECTOR_MAX_LENGTH, {
        message: '无效的正文选择器',
    })
    @IsString()
    readonly contentSelector: string;

    @ValidateIf(obj => {
        return obj.from !== CrawlerArticleFrom.ArticleFromNULL;
    })
    @MinLength(CrawlerConstants.FROM_TEMPLATE_MIN_LENGTH, {
        message: '无效的来源模板',
    })
    @MaxLength(CrawlerConstants.FROM_TEMPLATE_MAX_LENGTH, {
        message: '无效的来源模板',
    })
    @IsString()
    readonly fromTemplate: string;
}