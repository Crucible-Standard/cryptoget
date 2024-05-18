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

  private getMainResponse = async (
    request: express.Request,
    response: express.Response
  ) => {
    if (!request.query.token && !request.body.text) {
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
    const data = await getSingle(token);
    response.status(200).send(data);
  }
}

export default MainController;
