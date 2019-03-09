import '~/styles/main.scss';
import '~/styles/article/articleDetail.scss';
import '~/js/common/default.js';

(function() {
    $('.meta-bottom .more-share').click(function() {
        var shareListPop = $('#shareListPop');
        shareListPop.show();
        var shareListPopWidth = shareListPop.width();
        var parentWidth = shareListPop.parent().width();
        var moreShareWidth = $(this).outerWidth();
        shareListPop.css({
            left: parentWidth - moreShareWidth / 2 - shareListPopWidth / 2,
            top: -shareListPop.height() - 2
        });
    });
}());