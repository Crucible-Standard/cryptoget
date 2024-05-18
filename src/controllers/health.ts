import * as express from "express";
import { DefaultController } from "./";
import { getHealthCheck } from "../models/health";
import logger from "../utils/logger";

class HealthCheckController extends DefaultController {
  constructor() {
    super("/health");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getHealthCheck);
  }

  private getHealthCheck = (
    request: express.Request,
    response: express.Response
  ) => {
    const data = getHealthCheck();
    response.status(200).send(data);
  };
}

export default HealthCheckController;
