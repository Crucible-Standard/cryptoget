import * as express from "express";

class DefaultController {
  public path = "/";
  public router = express.Router();

  constructor(path: string, router?: express.Router) {
    this.path = path;
    this.router = router || express.Router();
  }
}

export { DefaultController };
