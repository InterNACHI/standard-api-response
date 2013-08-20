var utils = require('utils')
	Response = require('./Response.js');

/**
 * "OK" Response
 *
 * @param data - Response data
 * @param {Number} code - HTTP response code (should be 2xx)
 * @param {String} message - Response message
 * @constructor
 */
function OkResponse(data, code, message) {
	var defaultCode = this.codes.OK;

	if (!data && !message) {
		defaultCode = this.codes.NO_CONTENT;
	}

	code = code || defaultCode;
	OkResponse.super_.call(this, true, message, data, code);

	console.info('OK API Response:', this);
}

util.inherits(OkResponse, Response);
module.exports = OkResponse;