var util = require('util')
	Response = require('./Response.js');

/**
 * "OK" Response
 *
 * @param {*} data - Response data
 * @param {Number} code - HTTP response code (should be 2xx)
 * @param {String} message - Response message
 * @param {Object} meta - Metadata
 * @constructor
 */
function OkResponse(data, code, message, meta) {
	var defaultCode = this.codes.OK;

	if (!data && !message) {
		defaultCode = this.codes.NO_CONTENT;
	}

	code = code || defaultCode;
	OkResponse.super_.call(this, true, message, data, code, meta);

	// console.info('OK API Response:', this);
}

util.inherits(OkResponse, Response);
OkResponse.codes = Response.codes;

module.exports = OkResponse;