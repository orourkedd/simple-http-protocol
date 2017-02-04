'use strict';

var fetch = require('fetch-everywhere');

var _require = require('./util'),
    safep = _require.safep,
    success = _require.success,
    failure = _require.failure,
    isFailure = _require.isFailure,
    isProtocol = _require.isProtocol;

var assign = require('lodash/assign');
var keys = require('lodash/keys');
var curry = require('lodash/curry');

var defaultHeaders = {
  'Content-Type': 'application/json;charset=UTF-8'
};

function get(fetch, fetchOptions, url) {
  var defaultOptions = {
    method: 'GET',
    credentials: 'include'
  };

  return makeRequestWithOptions(fetch, url, defaultOptions, fetchOptions);
}

function post(fetch, fetchOptions, url, data) {
  var defaultOptions = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data || {}),
    headers: defaultHeaders
  };

  return makeRequestWithOptions(fetch, url, defaultOptions, fetchOptions);
}

function put(fetch, fetchOptions, url, data) {
  var defaultOptions = {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(data || {}),
    headers: defaultHeaders
  };

  return makeRequestWithOptions(fetch, url, defaultOptions, fetchOptions);
}

function remove(fetch, fetchOptions, url) {
  var defaultOptions = {
    method: 'DELETE',
    credentials: 'include'
  };

  return makeRequestWithOptions(fetch, url, defaultOptions, fetchOptions);
}

function makeRequestWithOptions(fetch, url, defaultOptions, fetchOptions) {
  var options = mergeOptions(defaultOptions, fetchOptions);
  return makeRequest(fetch, url, options);
}

function mergeOptions(a, b) {
  return assign({}, a, b);
}

function makeRequest(fetch, url, options) {
  return safep(fetch)(url, options).then(handleFetchResponse);
}

function handleFetchResponse(result) {
  //  result should always be a simple protocol object.
  //  if fetch errors out, there is no
  //  http response and no http response meta
  if (isFailure(result)) {
    return assign({}, result, {
      meta: {}
    });
  }

  var httpResponse = result.payload;

  if (httpResponse.ok) {
    return respondForHttpSuccess(httpResponse);
  } else {
    return respondForHttpError(httpResponse);
  }
}

function respondForHttpSuccess(httpResponse) {
  return parseHttpResponseBody(httpResponse).then(normalizeToProtocol(httpResponse, true));
}

function respondForHttpError(httpResponse) {
  return parseHttpResponseBody(httpResponse).then(normalizeToProtocol(httpResponse, false));
}

function parseHttpResponseBody(res) {
  return res.text().then(safeParseJson);
}

function safeParseJson(s) {
  try {
    return JSON.parse(s);
  } catch (e) {
    //  instead of an empty string,
    //  pass back null
    return s || null;
  }
}

var normalizeToProtocol = curry(function (httpResponse, isSuccess, payload) {
  if (isProtocol(payload)) {
    return addMetaToPayload(payload, httpResponse);
  } else if (isSuccess) {
    var successResult = success(payload);
    return addMetaToPayload(successResult, httpResponse);
  } else {
    var errorResult = failure(payload);
    return addMetaToPayload(errorResult, httpResponse);
  }
});

function addMetaToPayload(payload, httpResponse) {
  return assign({}, payload, {
    meta: getResponseMeta(httpResponse)
  });
}

function getResponseMeta(httpResponse) {
  return {
    status: httpResponse.status,
    statusText: httpResponse.statusText,
    headers: parseHeaders(httpResponse)
  };
}

function parseHeaders(httpResponse) {
  var headersRaw = httpResponse.headers._headers;
  return keys(headersRaw).reduce(function (p, c) {
    p[c] = headersRaw[c].join('');
    return p;
  }, {});
}

var noCredentials = {
  credentials: undefined
};

module.exports = {
  full: {
    post: curry(post),
    get: curry(get),
    remove: curry(remove),
    put: curry(put)
  },
  options: {
    post: curry(post)(fetch),
    get: curry(get)(fetch),
    remove: curry(remove)(fetch),
    put: curry(put)(fetch)
  },
  noCredentials: {
    post: curry(post)(fetch, noCredentials),
    get: curry(get)(fetch, noCredentials),
    remove: curry(remove)(fetch, noCredentials),
    put: curry(put)(fetch, noCredentials)
  },
  post: curry(post)(fetch, {}),
  get: curry(get)(fetch, {}),
  remove: curry(remove)(fetch, {}),
  put: curry(put)(fetch, {})
};