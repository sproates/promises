# promises

JavaScript promises library meeting Promises/A+ spec

## Usage

Example:


    'use strict';

    var Promise = require('./promises.js');

    function callApi() {

        console.log('callApi()');

        var p = new Promise();


        $.ajax('/api/noun')
            .done(function (data) {
                p.fulfill(data);
            })
            .fail(function (jqXHR, textStatus) {
                p.reject(textStatus);
            });

        return p;
    }

    function transformData(data) {
        console.log('transformData() ' + data);

        var p = new Promise(),
            newData  = '[' + data + ']';

        p.fulfill(newData);

        return p;
    }

    function renderData(data) {
        console.log('renderData() ' + data);
    }

    function fail(message) {
        console.warn('fail: ' + message);
    }

    callApi()
        .then(transformData, fail)
        .then(renderData, fail);
