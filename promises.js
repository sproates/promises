
(function (define) {

    'use strict';

    define(function () {

        /**
         * Public interface. Wraps the Promise implementation.
         * @constructor
         */
        var PromiseWrapper = function () {
            var promise = new Promise();

            this.fulfill = function (value) {
                return promise.fulfill(value);
            };

            this.reject = function (reason) {
                return promise.reject(reason);
            };

            this.then = function (onFulfilled, onRejected) {
                return promise.then(onFulfilled, onRejected);
            };
        };

        return PromiseWrapper;
    });

    function returnedPromise(p, child) {
        p.then(function (value) {
            child.fulfill(value);
        }, function (reason) {
            child.reject(reason);
        });
    }

    function callCallback(callback, value, promise) {
        try {
            var ret = callback(value);
            if (ret && typeof ret.then === 'function') {
                returnedPromise(ret, promise);
            } else {
                promise.fulfill(ret);
            }
        } catch (e) {
            promise.reject(e);
        }
    }

    var Promise = function () {
        var self = this;

        self.state = 'pending';
        self.value = null;
        self.reason = null;
        self.callbacks = [];
    };

    Promise.prototype = {

        fulfill: function (value) {
            var self = this;

            if (self.state !== 'pending') {
                return;
            }

            self.callFulfilled(value);
        },

        reject: function (reason) {
            var self = this;

            if (self.state !== 'pending') {
                return;
            }

            self.callRejected(reason);
        },

        then: function (onFulfilled, onRejected) {
            var self = this,
                p = new Promise();

            self.callbacks.push({
                onFulfilled: (typeof onFulfilled === 'function') ? onFulfilled : false,
                onRejected: (typeof onRejected === 'function') ? onRejected : false,
                child: p
            });

            self.callImmediate();

            return p;
        },

        callImmediate: function () {
            var self = this;

            if (self.state === 'fulfilled') {
                setTimeout(function () {
                    self.callFulfilled(self.value);
                });
            } else if (self.state === 'rejected') {
                setTimeout(function () {
                    self.callRejected(self.reason);
                });
            }
        },

        callFulfilled: function (value) {
            var self = this;

            self.state = 'fulfilled';
            self.value = value;

            self.callFulfilledCallbacks();

            self.callbacks = [];
        },

        callFulfilledCallbacks: function () {
            var self = this;

            for (var i = 0; i < self.callbacks.length; i++) {
                if (self.callbacks[i].onFulfilled !== false) {
                    callCallback(self.callbacks[i].onFulfilled, self.value, self.callbacks[i].child);
                } else {
                    self.callbacks[i].child.fulfill(self.value);
                }
            }
        },

        callRejected: function (reason) {
            var self = this;

            self.state = 'rejected';
            self.reason = reason;

            self.callRejectedCallbacks();

            self.callbacks = [];
        },

        callRejectedCallbacks: function () {
            var self = this;

            for (var i = 0; i < self.callbacks.length; i++) {
                if (self.callbacks[i].onRejected !== false) {
                    callCallback(self.callbacks[i].onRejected, self.reason, self.callbacks[i].child);
                } else {
                    self.callbacks[i].child.reject(self.reason);
                }
            }
        }
    };

})((typeof define === 'function') ? define : function (f) { 'use strict'; module.exports = f(); });
