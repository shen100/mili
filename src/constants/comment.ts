export class CommentConstants {
    static readonly MinContentLength: number = 1;
    static readonly MaxContentLength: number = 500;

    static readonly ArticleTable: string = 'articles';
    static readonly BookChapterTable: string = 'book_chapters';
    static readonly BoilingPointTable: string = 'boilingpoints';

    static readonly BookChapterCollectionTable: string = 'books';

    static readonly LikeArticleCommentTable: string = 'like_article_comments';
    static readonly LikeBookChapterCommentTable: string = 'like_bookchapter_comments';
    static readonly LikeBoilingPointCommentTable: string = 'like_boiling_comments';

    static readonly ArticleCommentTable: string = 'article_comments';
    static readonly BookChapterCommentTable: string = 'book_chapter_comments';
    static readonly BoilingPointCommentTable: string = 'boilingpoint_comments';

    static readonly SourceArticle = 'article';
    static readonly SourceBoilingPoint = 'boilingpoint';
    static readonly SourceBookChapter = 'bookchapter';
}
