import * as express from "express";
import { DefaultController } from "./";

class MainController extends DefaultController {
  constructor() {
    super("/");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(this.path, this.getMainResponse);
  }

  private getMainResponse = (
    request: express.Request,
    response: express.Response
  ) => {
    response.status(200).send({
      data: "ok",
    });
  };
}

export default MainController;
