import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CrawlerArticleFrom {
    ArticleFromNULL = 0, // 无来源，调抓取接口时，接口直接返回文章内容，不入库

    ArticleFromJianShu = 1, // 简书

    ArticleFromZhihu = 2, // 知乎

    ArticleFromHuxiu = 3, // 虎嗅

    ArticleFromSegmentFault = 4, // SegmentFault

    ArticleFromSegmentJuejin = 5, // 掘金

    ArticleFromCustom = 1000, // 自定义
}

export const CrawlerArticleFromLabelMap = {
    [CrawlerArticleFrom.ArticleFromNULL]: '无',

    [CrawlerArticleFrom.ArticleFromJianShu]: '简书',

    [CrawlerArticleFrom.ArticleFromZhihu]: '知乎',

    [CrawlerArticleFrom.ArticleFromHuxiu]: '虎嗅',

    [CrawlerArticleFrom.ArticleFromSegmentFault]: 'SegmentFault',

    [CrawlerArticleFrom.ArticleFromSegmentJuejin]: '掘金',

    [CrawlerArticleFrom.ArticleFromCustom]: '自定义',
};

export enum CrawlerPageType {
	Content = 'content', // 抓取单篇文章
    List = 'list', // 抓取一批文章
}

// 爬虫抓取的文章
@Entity({name: 'crawler_articles'})
export class CrawlerArticle {
    @PrimaryGeneratedColumn()
    id: number;

	@Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 500 })
    title: string;

    @Column('text')
    content: string;

    @Column('varchar', { length: 1000 })
    url: string;

    @Column('int', { name: 'from' })
    from: number;

    @Column('int', { name: 'article_id' })
    articleID: number;
}
