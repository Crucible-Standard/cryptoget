import * as express from "express";
import { DefaultController } from "./";
import { getSingle } from "../models/main";

class SlackController extends DefaultController {
  constructor() {
    super("/slack");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(this.path, this.getSlackResponseRandom);
  }

  private getSlackResponseRandom = async (
    request: express.Request,
    response: express.Response
  ) => {
    if (request.query.token || request.body.text) {
      const token = `${request.query.token}` || `${request.body.text}`;
      // check to see if token is at least 3 characters
      if (token.length > 2) {
        const data = await getSingle(token);

        response.status(200).send({
          response_type: "in_channel",
          text: `${data.data.message}`,
        });
      } else {
        response.status(400).send({
          data: {
            message:
              "Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth",
          },
          meta: {
            status: 400,
          },
        });
      }
    }
  };
}

export default SlackController;
