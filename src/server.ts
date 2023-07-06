import App from "./app";

import HealthCheckController from "./controllers/health";
import MainController from "./controllers/main";
import SlackController from "./controllers/slack";

const app = new App([
  new HealthCheckController(),
  new MainController(),
  new SlackController(),
]);

app.listen();
