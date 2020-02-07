import axios from 'axios';

function addURLPrefix(url) {
    if (url && url.charAt(0) === '/') {
        url = globalConfig.apiPrefix + url;
    }
    return url;
}
export const myHTTP = {
    get: function(url) {
        url = addURLPrefix(url);
        return axios.get(url);
    },
    post: function(url, data) {
        const config = {};
        if (url && url.charAt(0) === '/') {
            config.headers = {
                'x-csrf-token': globalConfig.csrfToken
            };
        }
        url = addURLPrefix(url);
        return axios.post(url, data, config);
    },
    put: function(url, data) {
        const config = {};
        if (url && url.charAt(0) === '/') {
            config.headers = {
                'x-csrf-token': globalConfig.csrfToken
            };
        }
        url = addURLPrefix(url);
        return axios.put(url, data, config);
    },
    delete: function(url, data) {
        const config = {};
        if (url && url.charAt(0) === '/') {
            config.headers = {
                'x-csrf-token': globalConfig.csrfToken
            };
        }
        url = addURLPrefix(url);
        return axios.delete(url, config); 
    }
}