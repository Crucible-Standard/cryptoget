import { NextFunction, Request, Response } from "express";

/**
 * Philosophically don't look to adopt the perfect response shape,
 * instead look to adopt the one you like and then adapt it to your needs.
 * Errors, and adding RESTful information is a good ideal.
 * statusCode, error message, and stack trace or error payloads are enough for most cases.
 * @description This middleware is used to extend the Error global object to add additional properties and context. It also adds a method to the Error object to append additional messages to the error message.
 * @constructor HttpException
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} name - Error data
 * @param {string} data - Optional error payload
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
class HttpException extends Error {
  public readonly statusCode: number;
  public message: string;
  public name: string;
  public readonly data?: string;

  /**
   * A generic Exception class for HTTP responses
   * @param statusCode {number} - HTTP status code
   * @param message {string} - Error message
   * @param name {string} - Error data
   * @param data {string} - Optional error payload
   */
  constructor(status: number, message: string, name: string, data?: string) {
    super(message);
    this.statusCode = status;
    this.message = message;
    this.name = name;
    if (typeof data !== "undefined") {
      this.data = data;
    }
  }

  /**
   *
   * @param message {string} - additional messages to be added to the error message
   */
  appendMessage(message: string) {
    this.message += ` ${message}`;
  }
}

const exceptions = [
  new HttpException(
    400,
    "The request syntax is malformed or invalid",
    "BadRequest"
  ),
  new HttpException(
    401,
    "You are not authorized, the client must authenticate itself to get the requested response.",
    "Unauthorized"
  ),
  new HttpException(402, "Payme", "PaymentRequired"),
  new HttpException(
    403,
    "You are not authorized, we know which user you are, but the item you requested is not allowed to be given to you",
    "Forbidden"
  ),
  new HttpException(
    404,
    "The item you are looking for is not found",
    "NotFound"
  ),
  new HttpException(
    405,
    "The method you are using is not allowed",
    "MethodNotAllowed"
  ),
  new HttpException(
    406,
    "The requested resource is not available in the format you requested",
    "NotAcceptable"
  ),
  new HttpException(407, "Proxy Authentication Required", "ProxyAuthRequired"),
  new HttpException(
    408,
    "The server timed out waiting for the request",
    "RequestTimeout"
  ),
  new HttpException(
    409,
    "The request could not be processed because of conflict in the request",
    "Conflict"
  ),
  new HttpException(
    410,
    "The requested resource is no longer available",
    "Gone"
  ),
  new HttpException(
    411,
    "The request did not specify the length of its content, which is required by the requested resource",
    "LengthRequired"
  ),
  new HttpException(
    412,
    "The server does not meet one of the preconditions that the requester put on the request",
    "PreconditionFailed"
  ),
  new HttpException(
    413,
    "The request is larger than the server is willing or able to process",
    "RequestEntityTooLarge"
  ),
  new HttpException(
    414,
    "The URI provided was too long for the server to process",
    "RequestURITooLong"
  ),
  new HttpException(
    415,
    "The request entity has a media type which the server or resource does not support",
    "UnsupportedMediaType"
  ),
  new HttpException(
    416,
    "The client has asked for a portion of the file, but the server cannot supply that portion",
    "RequestRangeNotSatisfiable"
  ),
  new HttpException(
    417,
    "The server cannot meet the requirements of the Expect request-header field",
    "ExpectationFailed"
  ),
  new HttpException(
    418,
    "The request was directed at a server that is not able to produce a response",
    "ImATeapot"
  ),
  new HttpException(
    421,
    "The request was directed at a server that is not able to produce a response",
    "ImATeapot"
  ),
  new HttpException(
    422,
    "The request was well-formed but was unable to be followed due to semantic errors",
    "UnprocessableEntity"
  ),
  new HttpException(
    423,
    "The resource that is being accessed is locked",
    "Locked"
  ),
  new HttpException(
    424,
    "The request failed due to failure of a previous request",
    "FailedDependency"
  ),
  new HttpException(
    426,
    "The client should switch to a different protocol",
    "UpgradeRequired"
  ),
  new HttpException(
    428,
    "The origin server requires the request to be conditional",
    "PreconditionRequired"
  ),
  new HttpException(
    429,
    "The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes",
    "TooManyRequests"
  ),
  new HttpException(
    431,
    "The server is unwilling to process the request because its header fields are too large",
    "RequestHeaderFieldsTooLarge"
  ),
  new HttpException(
    451,
    "The server is denying access to the resource as a consequence of a legal demand",
    "UnavailableForLegalReasons"
  ),
  new HttpException(
    500,
    "The server has encountered a situation it doesn't know how to handle",
    "InternalServerError"
  ),
  new HttpException(
    501,
    "The request method is not supported by the server and cannot be handled",
    "NotImplemented"
  ),
  new HttpException(
    502,
    "The server received an invalid response from a server it consulted when acting as a proxy or gateway",
    "BadGateway"
  ),
  new HttpException(
    503,
    "The server is currently unavailable (because it is overloaded or down for maintenance)",
    "ServiceUnavailable"
  ),
  new HttpException(
    504,
    "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server",
    "GatewayTimeout"
  ),
  new HttpException(
    505,
    "The server does not support the HTTP protocol version used in the request",
    "HTTPVersionNotSupported"
  ),
  new HttpException(
    506,
    "Transparent content negotiation for the request results in a circular reference",
    "VariantAlsoNegotiates"
  ),
  new HttpException(
    507,
    "The server is unable to store the representation needed to complete the request",
    "InsufficientStorage"
  ),
  new HttpException(
    508,
    "The server detected an infinite loop while processing the request",
    "LoopDetected"
  ),
  new HttpException(
    510,
    "Further extensions to the request are required for the server to fulfill it",
    "NotExtended"
  ),
  new HttpException(
    511,
    "The client needs to authenticate to gain network access",
    "NetworkAuthenticationRequired"
  ),
];

/**
 *
 * @param statusCode {number} - the status code of the error
 * @returns {HttpException} - the exception
 */
function getExceptionByStatusCode(statusCode: number): HttpException {
  const exception = exceptions.find((e) => e.statusCode === statusCode);
  if (exception) {
    return exception;
  }
  return new HttpException(
    statusCode,
    `Unknown status code ${statusCode}`,
    "Unknown"
  );
}

const code = getExceptionByStatusCode;

/**
 * @description - Express error middleware object
 * @example
 *  app.use(errorMiddleware);
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 */
function errorMiddleware(
  error: Error | HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (response.headersSent) {
    return next(error);
  }
  if (error instanceof HttpException) {
    response.status(error.statusCode);
    response.send(error);
  } else {
    response.status(500);
    response.send(code(500));
  }
}

export { errorMiddleware, exceptions, HttpException, code };
