var vows = require('vows'),
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
		}
	}
}).run({
	reporter: specReporter
});