import '~/js/common/common.js';
import '~/styles/index.css';
import $ from 'jquery';
import { myHTTP } from '~/js/common/net.js';

(function() {
    let page = 1;
    let maxAutoPage = 3;
    let isLoading = false;

    function load() {
        isLoading = true;
        let url = globalConfig.apiPrefix + '/articles/?format=html&page=' + (page + 1);
        myHTTP.get(url).then((result) => {
            isLoading = false;
            page++;
            $('#articleBox').append(result.data);
            if (page >= maxAutoPage) {
                $('.load-more').css('display', 'block');
                $('.article-placeholder').hide();
            }
        });
    }

    $('.load-more').click(function(event) {
        event.preventDefault();
        $('.article-placeholder').show();
        $('.load-more').hide();
        load();
    });

    function onScroll() {
        if (page >= maxAutoPage) {
            $(window).unbind('scroll', onScroll);
            return;
        }
        if (isLoading) {
            return;
        }
        let height = $(document).height() - $(window).height() 
        if ($(window).scrollTop() >= height * 0.75) {
            load();
        }  
    }

    $(window).scroll(onScroll);
}());