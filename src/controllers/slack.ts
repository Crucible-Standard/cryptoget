import * as express from "express";
import { DefaultController } from "./";
import { getSingle } from "../models/main";
import logger from "../utils/logger";

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
    if (!request.query.token && !request.body.text) {
      logger.info("Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth");
      response.status(400).send({
        data: {
          message:
            "Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth",
        },
        meta: {
          status: 400,
        },
      });
      return;
    }
    const token = `${request.query.token}` || `${request.body.text}`;
    logger.info(`${JSON.stringify(request.body)} request body`);
    const data = await getSingle(token);
    response.status(200).send({
      response_type: "in_channel",
      text: `${data.data.message}`,
    });
  };
}

export default SlackController;
