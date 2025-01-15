Here is a list of HTTP status codes, categorized by their range, along with their meanings and typical use cases:

### **1xx: Informational**
These status codes indicate that the request has been received and the server is continuing to process it.

- **100 Continue**: The server has received the request headers, and the client should proceed to send the request body.
- **101 Switching Protocols**: The server is switching protocols according to the client's request.
- **102 Processing** (WebDAV): The server is processing the request, but no response is available yet.
- **103 Early Hints**: Used to send some response headers before the final response.

### **2xx: Success**
These status codes indicate that the request was successfully received, understood, and accepted.

- **200 OK**: The request has succeeded, and the response contains the requested data.
- **201 Created**: The request has been fulfilled and resulted in the creation of a new resource.
- **202 Accepted**: The request has been accepted for processing, but the processing has not been completed.
- **203 Non-Authoritative Information**: The server successfully processed the request, but the returned data may be from a cache or a different source.
- **204 No Content**: The server successfully processed the request, but there is no content to return.
- **205 Reset Content**: The server successfully processed the request, and the client should reset the document view.
- **206 Partial Content**: The server is delivering part of the resource (as specified in the `Range` header).

### **3xx: Redirection**
These status codes indicate that further action is required by the client to complete the request.

- **300 Multiple Choices**: The request has more than one possible response, and the client must choose one.
- **301 Moved Permanently**: The resource has been permanently moved to a new URI, and the client should use the new URI.
- **302 Found** (Previously "Moved Temporarily"): The resource is temporarily located at a different URI, but the client should continue using the original URI.
- **303 See Other**: The client should access the resource using a different URI (usually with a GET request).
- **304 Not Modified**: The resource has not been modified since the last request (used for caching purposes).
- **305 Use Proxy**: The requested resource must be accessed through a proxy.
- **306 (Unused)**: No longer in use. Reserved for future use.
- **307 Temporary Redirect**: The resource has temporarily moved to a different URI, but the client should continue using the original URI for future requests.
- **308 Permanent Redirect**: The resource has permanently moved to a new URI, and the client should use the new URI for future requests.

### **4xx: Client Errors**
These status codes indicate that there was an error with the request made by the client.

- **400 Bad Request**: The server could not understand the request due to invalid syntax.
- **401 Unauthorized**: The request lacks valid authentication credentials (e.g., login required).
- **402 Payment Required**: Reserved for future use (payment systems).
- **403 Forbidden**: The server understood the request but refuses to authorize it.
- **404 Not Found**: The server cannot find the requested resource.
- **405 Method Not Allowed**: The request method is not allowed for the resource (e.g., trying to DELETE when only GET is supported).
- **406 Not Acceptable**: The server cannot generate a response that is acceptable to the client based on the `Accept` headers.
- **407 Proxy Authentication Required**: The client must authenticate itself with the proxy.
- **408 Request Timeout**: The server timed out waiting for the request from the client.
- **409 Conflict**: The request could not be completed due to a conflict (e.g., trying to create a resource that already exists).
- **410 Gone**: The resource is no longer available and will not be available again.
- **411 Length Required**: The server requires the `Content-Length` header to be specified.
- **412 Precondition Failed**: One or more conditions specified in the request header fields were not met.
- **413 Payload Too Large**: The request is larger than the server is willing or able to process.
- **414 URI Too Long**: The URI provided was too long for the server to process.
- **415 Unsupported Media Type**: The request's media type is not supported by the server.
- **416 Range Not Satisfiable**: The server cannot fulfill the range request specified by the `Range` header.
- **417 Expectation Failed**: The server cannot meet the expectation specified by the `Expect` header.
- **418 I'm a teapot**: A humorous status code defined in the "418 I'm a teapot" RFC (RFC 2324).
- **421 Misdirected Request**: The request was directed at a server that is not able to produce a response.
- **422 Unprocessable Entity** (WebDAV): The server understands the content type but cannot process the instructions.
- **423 Locked** (WebDAV): The resource is locked.
- **424 Failed Dependency** (WebDAV): The request failed because it depended on another operation that failed.
- **425 Too Early**: The server is unwilling to risk processing a request that might be replayed.
- **426 Upgrade Required**: The client should upgrade to a different protocol (e.g., HTTP/2).
- **427 Unassigned**: Not assigned.
- **428 Precondition Required**: The server requires the request to be conditional.
- **429 Too Many Requests**: The user has sent too many requests in a given amount of time.
- **431 Request Header Fields Too Large**: The request's header fields are too large.
- **451 Unavailable For Legal Reasons**: The resource is unavailable due to legal reasons.

### **5xx: Server Errors**
These status codes indicate that the server failed to fulfill a valid request.

- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.
- **501 Not Implemented**: The server does not support the functionality required to fulfill the request.
- **502 Bad Gateway**: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable**: The server is currently unable to handle the request due to temporary overload or maintenance.
- **504 Gateway Timeout**: The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.
- **505 HTTP Version Not Supported**: The server does not support the HTTP version used in the request.
- **506 Variant Also Negotiates**: The server has an internal configuration error preventing it from fulfilling the request.
- **507 Insufficient Storage** (WebDAV): The server is unable to store the representation needed to complete the request.
- **508 Loop Detected** (WebDAV): The server detected an infinite loop while processing a request.
- **510 Not Extended**: The server requires further extensions to fulfill the request.
- **511 Network Authentication Required**: The client needs to authenticate to gain network access.

These status codes are part of the HTTP protocol and provide a standardized way for web servers to communicate the outcome of HTTP requests.