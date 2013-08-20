var util = require('util')
	Response = require('./Response.js');

/**
 * "Error" Response
 *
 * @param {String} message - Error message
 * @param {Number} code - HTTP code (should be > 2xx)
 * @param {Error} err - Error object passed to response
 * @constructor
 */
function ErrorResponse(message, code, err) {
	code = code || this.codes.INTERNAL_ERROR;
	ErrorResponse.super_.call(this, false, message, null, code, err);

	// console.warn('Bad API Response:', this);
}

util.inherits(ErrorResponse, Response);
module.exports = ErrorResponse;