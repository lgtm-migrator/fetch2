/**
 * @file context
 * Created by Xinyi on 2019/2/12.
 */

import method from './method'
import {paramsToString} from './utils'

export default class Context {
    /**
     * initialize a new context.
     * @param url
     * @param params
     * @param opts
     */
    constructor({url, params, opts}) {
        let request, headers, options = {}

        // Headers
        options.headers = headers = new Headers(Object.assign({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, opts.headers))

        // Options
        const keyString = ['method', 'mode', 'cache', 'credentials', 'redirect', 'referrer', 'body']

        keyString.every(item => {
            if (opts[item]) {
                options[item] = opts[item]
            }
            return true
        })

        const controller = new AbortController()
        options.signal = controller.signal

        if (params && options.method === method.GET) {
            url = `${opts.prefix || ''}${url}?${paramsToString(params)}`
        }

        // Body
        if (params && !options.body && options.method !== method.GET) {
            if (headers.get('Content-Type') === 'multipart/form-data') {
                options.body = (function (params) {
                    const fd = new FormData()
                    for (const key in params) {
                        fd.append(key, params[key])
                    }
                    return fd
                }(params))
                headers.set('Content-Type', 'application/x-www-form-urlencoded')
            }
            else {
                options.body = JSON.stringify(params)
            }
        }

        // Request
        request = new Request(url, options)

        this.request = arguments
        this._request = request
        this._headers = headers
        this._controller = controller
    }
}