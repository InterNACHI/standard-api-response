/**
 *
 * @param {Boolean} ok - !error
 * @param {String} message - Any response message
 * @param data - Response data
 * @param {Number} code - HTTP response code
 * @param {Error} err - Error object passed on to the response
 * @param {*} data - Response data
 * @param {Number=} code - HTTP response code
 * @param {Object=} meta - Metadata
 * @param {Error=} err - Error object passed on to the response
 * @constructor
 */
function Response(ok, message, data, code, err) {
	this.ok = Boolean(ok);
	this.message = message || (this.ok ? 'OK' : 'Error');
	this.data = data || null;

	code && (this.httpCode = Number(code));
	err && (this.error = err);
}

/**
 * Common response codes
 * @expose
 * @type {Object.<string, number>}
 */
Response.codes = {
	OK: 200, // Response to a successful GET, PUT, PATCH or DELETE. Can also be used for a POST that doesn't result in a creation.
	CREATED: 201, // Response to a POST that results in a creation. Should be combined with a Location header pointing to the location of the new resource
	NO_CONTENT: 204, // Response to a successful request that won't be returning a body (like a DELETE request)
	NOT_MODIFIED: 304, // Used when HTTP caching headers are in play
	BAD_REQUEST: 400, // The request is malformed, such as if the body does not parse
	UNAUTHORIZED: 401, // When no or invalid authentication details are provided. Also useful to trigger an auth popup if the API is used from a browser
	FORBIDDEN: 403, // When authentication succeeded but authenticated user doesn't have access to the resource
	NOT_FOUND: 404, // When a non-existent resource is requested
	METHOD_NOT_ALLOWED: 405, // When an HTTP method is being requested that isn't allowed for the authenticated user
	GONE: 410, // Indicates that the resource at this end point is no longer available. Useful as a blanket response for old API versions
	UNSUPPORTED_MEDIA_TYPE: 415, // If incorrect content type was provided as part of the request
	UNPROCESSABLE_ENTITY: 422, // Used for validation errors
	TOO_MANY_REQUESTS: 429, // When a request is rejected due to rate limiting
	INTERNAL_ERROR: 500 // Catch-all/Unknown error
}

/**
 * Pointer to codes for instances to use
 * @expose
 * @type {Object.<string, number>}
 */
Response.prototype.codes = Response.codes;

/**
 * Whether the response was OK
 * @expose
 * @type {Boolean}
 */
Response.prototype.ok = false;

/**
 * Response error message
 * @expose
 * @type {string}
 */
Response.prototype.message = 'Error';

/**
 * Response data
 * @expose
 * @type {*}
 */
Response.prototype.data = null;

/**
 * Response HTTP code
 * @see {Response.codes}
 * @type {number}
 */
Response.prototype.httpCode = 500;

/**
 * Response error object
 * @type {?Error}
 */
Response.prototype.error = null;

/**
 * Send response to an Express res object
 *
 * @param {express.res} res
 * @returns express.res
 */
Response.prototype.send = function(res) {
	if ('undefined' == typeof res.req.query[res.app.get('jsonp callback name')]) {
		res.status(this.httpCode);
	}

	if (this.codes.NO_CONTENT == this.httpCode) {
		return res.end();
	}

	return res.jsonp(this);
}

module.exports = Response;