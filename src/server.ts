import App from "./app";

import HealthCheckController from "./controllers/health";
import LunarController from "./controllers/lunar";
import SlackController from "./controllers/slack";

const app = new App([
  new HealthCheckController(),
  new LunarController(),
  new SlackController(),
]);

app.listen();
