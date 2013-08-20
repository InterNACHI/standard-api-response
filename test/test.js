var vows = require('vows'),
	assert = require('assert'),
	specReporter = require("vows/lib/vows/reporters/spec");

// Geocoder Test Suite
vows.describe('When geocoding').addBatch({
	'An OK API Response': {
		topic: function() {
			// geocoder.geocode(testData.validAddress.address, this.callback);
		},

		'has a true "ok" property': function (err, coords) {
			// assert.isNull(err);
		}
	}
}).run({
	reporter: specReporter
});