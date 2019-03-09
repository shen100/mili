import '~/styles/user/user.css';
import '~/js/common/default.js';
import { Pinterest } from '~/js/common/pinterest';

let articlesPinterest;

function createArticlesPinterest(sort, page) {
    articlesPinterest = new Pinterest('/u/articles/', $('#articleList'), {
        page: page,
        query: {
            userID: jsonData.userID,
            sort: sort
        },
        loadComplete: function() {
            $('.article-placeholder').hide();
        }
    });
    $('.article-placeholder').show();
}

// 第1页已渲染，从第2页开始加载
createArticlesPinterest('createdat', 2);

$('.trigger-menu li').click(function() {
    const curTab = $(this);
    curTab.parent().find('li').removeClass('active');
    curTab.addClass('active');
    const sort = curTab.attr('id').split('-')[1];
    articlesPinterest.destory();
    // 切换tab时，从第1页开始加载
    createArticlesPinterest(sort, 1);
});

// 关注、取消关注
(function() {
    $('.main').delegate('.followbtn', 'click', function() {
        // todo
        // 发http请求，得到响应后，执行下面的操作
        const followBtn = $(this);
        const userID = followBtn.attr('id').split('-')[1];
        followBtn.hide();
        const followedBtn = $('#followed-' + userID);
        followedBtn.show();
        followedBtn.addClass('user-follow-button-on-hover');
        followedBtn.find('span').html('取消关注');
    });
    
    $('.main').delegate('.followedbtn', 'click', function() {
        // todo
        // 发http请求，得到响应后，执行下面的操作
        const followedBtn = $(this);
        const userID = followedBtn.attr('id').split('-')[1];
        followedBtn.hide();
        $('#follow-' + userID).show();
    });
    
    $('.main').delegate('.followedbtn', 'mouseenter', function() {
        const followedBtn = $(this);
        followedBtn.addClass('user-follow-button-on-hover');
        followedBtn.find('span').html('取消关注');
    });
    
    $('.main').delegate('.followedbtn', 'mouseleave', function() {
        const followedBtn = $(this);
        followedBtn.removeClass('user-follow-button-on-hover');
        followedBtn.find('span').html('已关注');
    });
}());