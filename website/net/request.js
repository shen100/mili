'use strict'

const axios = require('axios')
const config = require('~/config')
const apiConfig = require('~/config/apiConfig')
const adminAPIConfig = require('~/config/adminAPIConfig')

const req = {}

function send (key, options) {
    return new Promise((resolve, reject) => {
        let theConfig = apiConfig[key] || adminAPIConfig[key]
        options = options || {}
        var url = theConfig.url
        theConfig.method = theConfig.method.toLocaleLowerCase()

        if (options.params) {
            let params = options.params
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    url = url.replace(':' + key, params[key])
                }
            }
        }

        if (theConfig.method === 'post' || theConfig.method === 'put') {
            options.body = options.body || {}
        }

        if (options.query) {
            let query = options.query
            let queryArr = []
            for (let key in query) {
                if (query.hasOwnProperty(key)) {
                    queryArr.push(key + '=' + query[key])
                }
            }
            if (queryArr.length > 0) {
                url += '?' + queryArr.join('&')
            }
        }

        let axiosConfig = {
            method: theConfig.method,
            url: url,
            headers: {}
        }
        if (config.useProxy && process.env.NODE_ENV === 'development') {
            axiosConfig.proxy = config.proxy
        }
        let client = options.client
        if (typeof window === 'undefined' && !client) {
            throw new Error(key + ': client不能为空')
        }
        if (client && client.headers) {
            if (client.headers['user-agent']) {
                axiosConfig.headers['User-Agent'] = client.headers['user-agent']
            }
            if (client.headers['cookie']) {
                axiosConfig.headers['Cookie'] = client.headers['cookie']
            }
        }

        if (theConfig.method === 'post' || theConfig.method === 'put') {
            axiosConfig.data = options.body
        }

        var startTime = new Date().getTime()
        axios(axiosConfig)
            .then(function (response) {
                if (typeof window === 'undefined') {
                    console.log({
                        url: url,
                        time: (new Date().getTime() - startTime) + 'ms'
                    })
                }
                return resolve(response.data)
            })
            .catch(function (error) {
                return reject(error)
            })
    })
}

for (let key in apiConfig) {
    if (apiConfig.hasOwnProperty(key)) {
        req[key] = (options) => {
            return send(key, options)
        }
    }
}

for (let key in adminAPIConfig) {
    if (req.hasOwnProperty(key)) {
        throw new Error('apiConfig already has key ' + key)
    }
    if (adminAPIConfig.hasOwnProperty(key)) {
        req[key] = (options) => {
            return send(key, options)
        }
    }
}

export default req
