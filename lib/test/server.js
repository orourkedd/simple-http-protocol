'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var stopServer = void 0;
var requestPayload = void 0;

function startServer(route) {
  if (!stopServer) {
    stopServer = function stopServer() {
      return Promise.resolve();
    };
  }

  return stopServer().then(function () {
    return new Promise(function (resolve, reject) {
      var app = express();
      app.use(bodyParser.json());

      var fn = void 0;
      if (route.fn) {
        fn = route.fn;
      } else {
        fn = function fn(req, res) {
          res.send(route.payload);
        };
      }

      app[route.method](route.path || '/', function (req, res) {
        res.set('test', 'test-header');
        requestPayload = {
          headers: req.headers,
          body: req.body
        };
        fn(req, res);
      });

      function getRequestData() {
        return requestPayload;
      }

      var server = app.listen(3001, function (err) {
        if (err) {
          reject(err);
        } else {
          stopServer = function stopServer() {
            return new Promise(function (resolve, reject) {
              server.close(function (err) {
                if (err) return reject(err);
                resolve();
              });
            });
          };
          resolve({
            stopServer: stopServer,
            getRequestData: getRequestData
          });
        }
      });
    });
  });
}

module.exports = {
  startServer: startServer
};