import * as express from "express";
import { DefaultController } from "./";
import { getSingle } from "../models/main";

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
    const token = `${request.query.token}` || `${request.body.text}`;
    const price = getSingle(token);

    response.status(200).send({
      data: {
        message: `The price of ${token} is $${price}USD`,
        price: price,
        token: token,
      },
      meta: {
        status: 200,
      },
    });
  };
}

export default MainController;
