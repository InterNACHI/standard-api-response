var vows = require('vows'),
	sinon = require('sinon'),
	assert = require('assert'),
	specReporter = require("vows/lib/vows/reporters/spec"),
	pkg = require('../index.js'),
	OkResponse = pkg.OkResponse,
	ErrorResponse = pkg.ErrorResponse,
	testMessage = 'Dream Team',
	testData = {
		michael: 'Jordan',
		charles: 'Barkley'
	};

function getMockResponse(jsonp) {
	var rand = Math.floor(Math.random() * 99999),
		cbKey = 'cbk' + rand,
		cbVal = 'cbv' + rand,
		mock = {
			req: {
				'query': {}
			},
			app: {
				get: sinon.stub()
			},
			status: sinon.spy(),
			end: sinon.spy(),
			jsonp: sinon.spy()
		};

	// Set up stubs
	mock.app.get.withArgs('jsonp callback name').returns(cbKey);

	if (jsonp) {
		mock.req.query[cbKey] = cbVal;
	}

	return mock;
}

// Geocoder Test Suite
vows.describe('API Response Package').addBatch({
	'An empty OK API response': {
		topic: function() {
			return new OkResponse();
		},
		'has a truthy "ok" property': function (resp) {
			assert.ok(resp.ok);
		},
		'returns an "OK" message': function (resp) {
			assert.equal(resp.message, 'OK');
		},
		'returns a 204 (no content) HTTP code': function (resp) {
			assert.equal(resp.httpCode, 204);
		},
		'has a null "data" property': function (resp) {
			assert.isNull(resp.data);
		},
		'has a null "error" property': function (resp) {
			assert.isNull(resp.error);
		},
		'has an empty object "meta" property': function (resp) {
			var count = 0;
			for (key in resp.meta) {
				if (obj.hasOwnProperty(key)) count++;
			}

			assert.isObject(resp.meta);
			assert.equal(count, 0);
		}
	},
	'An OK API response with data & message': {
		topic: function() {
			return new OkResponse(testData, null, testMessage);
		},
		'has a truthy "ok" property': function (resp) {
			assert.ok(resp.ok);
		},
		'returns the provided message': function (resp) {
			assert.equal(resp.message, testMessage);
		},
		'returns a 200 HTTP code': function (resp) {
			assert.equal(resp.httpCode, 200);
		},
		'has a "data" property that matches provided data': function (resp) {
			assert.isObject(resp.data);
			assert.equal(resp.data, testData);
		},
		'has a null "error" property': function (resp) {
			assert.isNull(resp.error);
		},
		'has an empty object "meta" property': function (resp) {
			var count = 0;
			for (key in resp.meta) {
				if (obj.hasOwnProperty(key)) count++;
			}

			assert.isObject(resp.meta);
			assert.equal(count, 0);
		}
	},
	'An empty Error API response': {
		topic: function() {
			return new ErrorResponse();
		},
		'has a false "ok" property': function (resp) {
			assert.equal(resp.ok, false);
		},
		'returns an "Error" message': function (resp) {
			assert.equal(resp.message, 'Error');
		},
		'returns a 500 (internal error) HTTP code': function (resp) {
			assert.equal(resp.httpCode, 500);
		},
		'has a null "data" property': function (resp) {
			assert.isNull(resp.data);
		},
		'has a null "error" property': function (resp) {
			assert.isNull(resp.error);
		},
		'has an empty object "meta" property': function (resp) {
			var count = 0;
			for (key in resp.meta) {
				if (obj.hasOwnProperty(key)) count++;
			}

			assert.isObject(resp.meta);
			assert.equal(count, 0);
		}
	},
	'An 404 Error API response': {
		topic: function() {
			var err = new Error();
			return new ErrorResponse(testMessage, ErrorResponse.codes.NOT_FOUND, err);
		},
		'has a false "ok" property': function (resp) {
			assert.equal(resp.ok, false);
		},
		'returns the provided message': function (resp) {
			assert.equal(resp.message, testMessage);
		},
		'returns a 404 (not found) HTTP code': function (resp) {
			assert.equal(resp.httpCode, 404);
		},
		'has a null "data" property': function (resp) {
			assert.isNull(resp.data);
		},
		'has an "error" property of type Error': function (resp) {
			assert.instanceOf(resp.error, Error);
		},
		'has an empty object "meta" property': function (resp) {
			var count = 0;
			for (key in resp.meta) {
				if (obj.hasOwnProperty(key)) count++;
			}

			assert.isObject(resp.meta);
			assert.equal(count, 0);
		}

	},
	'An OK API response with metadata': {
		topic: function() {
			return new OkResponse({}, 200, 'message', {
				key1: 'Key One',
				key2: 'Key Two'
			});
		},
		'has a "meta" property': function (resp) {
			assert.isObject(resp.meta);
		},
		'has populated meta property': function (resp) {
			assert.equal(resp.meta.key1, 'Key One');
			assert.equal(resp.meta.key2, 'Key Two');
		}
	},
	'Responding to a JSON request': {
		topic: function() {
			var res = getMockResponse(false),
				resp = new OkResponse({ 'test': 'data' });

			resp.send(res);

			return {'res': res, 'resp': resp};
		},
		'looks up the jsonp callback name for res.app before sending': function(objs) {
			var res = objs.res;

			assert(res.app.get.withArgs('jsonp callback name').calledOnce);
			assert(res.app.get.calledBefore(res.end));
			assert(res.app.get.calledBefore(res.jsonp));
		},
		'sends an HTTP status code': function(objs) {
			var res = objs.res,
				resp = objs.resp;

			sinon.assert.calledWith(res.status, resp.httpCode);
		},
		'sends the Response object as JSONP data to the client': function(objs) {
			var res = objs.res,
				resp = objs.resp;

			sinon.assert.notCalled(res.end);
			sinon.assert.calledWith(res.jsonp, resp);
		}
	},
	'Responding to a JSONP request': {
		topic: function() {
			var res = getMockResponse(true),
				resp = new OkResponse({ 'test': 'data' });

			resp.send(res);

			return {'res': res, 'resp': resp};
		},
		'looks up the jsonp callback name for res.app before sending': function(objs) {
			var res = objs.res;

			assert(res.app.get.withArgs('jsonp callback name').calledOnce);
			assert(res.app.get.calledBefore(res.end));
			assert(res.app.get.calledBefore(res.jsonp));
		},
		'does not send an HTTP status code': function(objs) {
			var res = objs.res;
			sinon.assert.notCalled(res.status);
		},
		'sends the Response object as JSON data to the client': function(objs) {
			var res = objs.res,
				resp = objs.resp;

			sinon.assert.notCalled(res.end);
			sinon.assert.calledWith(res.jsonp, resp);
		}
	},
	'Responding with an empty response': {
		topic: function() {
			var res = getMockResponse(false),
				resp = new OkResponse();

			resp.send(res);

			return {'res': res, 'resp': resp};
		},
		'sends a 204 No Content HTTP code': function(objs) {
			var res = objs.res;

			sinon.assert.calledWith(res.status, 204);
		},
		'closes the response with no data': function(objs) {
			var res = objs.res;
			sinon.assert.notCalled(res.jsonp);
			sinon.assert.called(res.end);
		}
	}
}).run({
	reporter: specReporter
});