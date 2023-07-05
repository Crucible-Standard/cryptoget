import fetch from 'node-fetch';
import { formatMoney, formatPast } from "../utils/format";
import { default as logger } from "../utils/logger";

interface ResponseData {
  message: string;
  price: string;
  token: string;
}

interface ResponseMeta {
  status: number;
}

interface CryptoGetResponse {
  data: ResponseData;
  meta: ResponseMeta;
}

interface CryptoGetSlackResponse {
  response_type: string;
  text: string;
}

 function getSingle(token: string): Promise<string> {
  const apiUrl = "https://www.worldcoinindex.com/apiservice/ticker";
  const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${token}btc&fiat=usd`;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const unformatted_price = data.body.Markets[0].Price;
      const price = formatMoney(unformatted_price);
      // const label = data.body.Markets[0].Label.substring(0, 3);
      // const name = data.body.Markets[0].Name;
      // const volume = formatMoney(data.body.Markets[0].Volume_24h);
      // const lastTrade = formatPast(data.body.Markets[0].Timestamp);
      // let returnString = `1 ${label} = USD as of ${lastTrade} ago\n\r`;
      // returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
      // returnString =
      //   returnString +
      //   `${name} https://www.worldcoinindex.com/coin/${name}`;
      resolve(`${price}`);

    } catch (error) {
      logger.error(error);
      reject("Are you trying to make me crash?");
    }
  });
}

export { getSingle };
