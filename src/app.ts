import * as bodyParser from "body-parser";
import * as express from "express";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import { default as logger } from "./utils/logger";
import { corsMiddleware } from "./middleware/cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

interface Controller {
  path: string;
  router: express.Router;
}

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express.default();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(PORT, () => {
      logger.info(`App listening on the port ${PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  /**
   * Initialize Express Middlewares
   */
  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(bodyParser.json()); // support json encoded bodies
    this.app.use(express.urlencoded({ extended: true })); // support encoded bodies
    this.app.use(corsMiddleware);
  }

  /**
   * Initialize Express Controllers
   * @param controllers
   */
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}

export default App;
