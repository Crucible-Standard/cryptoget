import * as pkjson from "../../package.json";
import { toDDHHMMSS } from "../utils/format";

interface ResponseData {
  message: string;
}

interface ResponseMeta {
  date: string;
  uptime: string;
  version: string;
}

interface HealthCheckResponse {
  data: ResponseData;
  meta: ResponseMeta;
}

function getHealthCheck(): HealthCheckResponse {
  const time = process.uptime();
  const uptime = toDDHHMMSS(time);
  return {
    data: {
      message: "ok",
    },
    meta: {
      date: `${new Date().toISOString()}`,
      uptime: `${uptime}`,
      version: `${pkjson.version}`,
    },
  };
}

export { ResponseData, ResponseMeta, HealthCheckResponse, getHealthCheck };
