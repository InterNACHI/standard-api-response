Standard API Response
=====================

[![Build Status](https://travis-ci.org/InterNACHI/standard-api-response.png?branch=master)](https://travis-ci.org/InterNACHI/standard-api-response)

This is a generic API response object for consistent API output across services.
it is mostly meant for internal InterNACHI use, but anyone is welcome to use it.

Basic Usage
-----------

```javascript
app.post('/users', function(req, res) {
	// Handle provided data and build new user object
	// ...

	// Create API response object
	var apires = new OkResponse(user, OkResponse.codes.CREATED, 'User successfully created.');

	// Send to client
	apires.send(res);
}
```

Response Format
---------------

```
HTTP/1.1 200 OK
Content-Type: application/json

{
	"ok": true,
	"message": "User successfully created.",
	"data": { ... },
	"httpCode": 200, // Same as HTTP response code
	"error": { ... } // Only present if "ok" == false
}
```