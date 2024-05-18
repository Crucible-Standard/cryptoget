import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

/**
 * @description Middleware function to Check to see if the token is valid, Is at least 3 characters long, and exists in the request
 * @param {Request} request -  Express Request Object used to get token from body.text if POST/slack, or query.token if GET request
 * @param {Response} response - Express Response Object used to invoke 400 status code if token is invalid
 * @param {NextFunction} next - Express Next Function which is invoked if token is valid
 **/
function validateTokenMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // World Coin Index API Key, get your key from
  // https://www.worldcoinindex.com/apiservice/
  if (!process.env.KL_WCI_API_KEY || process.env.KL_WCI_API_KEY.length < 1) {
    logger.info(
      "API Key is missing, Please add an API key to the configuration"
    );
    response.status(400).send({
      data: {
        message:
          "API Key is missing, Please add an API key to the configuration",
      },
      meta: {
        status: 400,
      },
    });
  }
  next();
}

export { validateTokenMiddleware };
