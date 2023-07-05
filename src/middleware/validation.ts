import { NextFunction, Request, Response } from "express";

// Check to see if the token is valid
function validateTokenMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // World Coin Index API Key, get your key from
  // https://www.worldcoinindex.com/apiservice/
  if (process.env.KL_WCI_API_KEY.length < 1) {
    response.status(400).send({
      data: {
        message: "API Key is missing, Please add an API key to the configuration",
      },
      meta: {
        status: 400,
      },
    });
  }

  // check to see if token exists in request
  if (
    (request.query.token) ||
    (request.body.text)
  ) {
    const args = `${request.query.token}` || `${request.body.text}`;
    // check to see if token is at least 3 characters
    if (args.length > 2) {
      next();
    } else {
      response.status(400).send({
        data: {
          message: "Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth",
        },
        meta: {
          status: 400,
        },
      });
    }
  } else {
    response.status(400).send({
      data: {
        message: "Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth",
      },
      meta: {
        status: 400,
      },
    });
  }
}

export { validateTokenMiddleware };