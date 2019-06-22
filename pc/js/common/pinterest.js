export class Pinterest {
    constructor (url, el, options) {
        this.url = url;
        this.el = el;
        this.isLoading = false,
        this.page = options.page || 1;
        this.query = options.query;
        this.loadComplete = options.loadComplete;
        this._onLoad = this.onScroll.bind(this);
        $(window).scroll(this._onLoad);
        if (this.page === 1) {
            this._load();
        }
    }

    _load() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        var url = globalConfig.apiPrefix + this.url + '?format=html&page=' + this.page;
        for (let key in this.query) {
            url += ('&' + key + '=' + this.query[key]);
        }
        $.get(url, (result) => {
            if (!result) {
                $(window).unbind('scroll', this._onLoad);
                this.loadComplete && this.loadComplete();
            }
            this.isLoading = false;
            this.page++;
            this.el.append(result);
        });
    }

    onScroll() {
        var height = $(document).height() - $(window).height() 
        if ($(window).scrollTop() >= height * 0.75) {
            this._load();
        }  
    }

    destory() {
        if (this._onLoad) {
            $(window).unbind('scroll', this._onLoad);
        }
        this.el.html('');
    }
}