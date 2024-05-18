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
    const token = `${request.query.token}` || `${request.body.text}`;
    const data = await getSingle(token);

    response.status(200).send({
      response_type: "in_channel",
      text: `${data.data.message}`,
    });
  };
}

export default SlackController;
