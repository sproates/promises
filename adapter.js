
/**
 * Promises/A+ compliance adapter.
 * @see {@link https://github.com/promises-aplus/promises-tests}
 */
(function (global) {

    'use strict';

    if (typeof global.define !== 'function') {
        global.define = function (f) {
            module.exports = f();
        };
    }

    global.define(function () {

        var Promise = require('./promises');

        return {

            fulfilled: function (value) {
                var p = new Promise();
                p.fulfill(value);
                return p;
            },

            rejected: function (reason) {
                var p = new Promise();
                p.reject(reason);
                return p;
            },

            pending: function () {
                var p = new Promise();
                return {
                    promise: p,
                    fulfill: function (value) {
                        p.fulfill(value);
                    },
                    reject: function (reason) {
                        p.reject(reason);
                    }
                };
            }
        };
    });

})(this);
