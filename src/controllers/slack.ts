import * as express from "express";
import { DefaultController } from "./";
import { getLunarPhase } from "../models/lunar";
import {
  invalidDateMiddleware,
  invalidLanguageMiddleware,
} from "../middleware/validate";

class SlackController extends DefaultController {
  constructor() {
    super("/slack");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(this.path, this.getSlackResponseRandom);
    this.router
      .all(this.path, invalidDateMiddleware)
      .all(this.path, invalidLanguageMiddleware);
  }

  private getSlackResponseRandom = (
    request: express.Request,
    response: express.Response
  ) => {
    // no language defaulting to english
    const language = `${request.query.language}`;
    const date = new Date();

    const lunarPhase = getLunarPhase(date, language);

    response.status(200).send({
      response_type: "in_channel",
      text:
        lunarPhase.name +
        "(" +
        lunarPhase.symbol +
        ") " +
        lunarPhase.description,
    });
  };
}

export default SlackController;
