'use strict';
const Wreck = require('wreck');
const q = require('q');

module.exports = {
    getRequest: function(url) {
        let deferred = q.defer();

        Wreck.request("get", url, null, function(err, res) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            }

            /*
             The response is a Buffer stream which
             with need to read and turn into a json */
            Wreck.read(res, null, function (err, body) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }

                let parsedBody = JSON.parse(body.toString());
                deferred.resolve(parsedBody);
            });
        });

        return deferred.promise;
    }
};