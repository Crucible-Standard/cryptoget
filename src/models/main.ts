import { formatMoney, formatPast } from "../utils/format";
import { default as logger } from "../utils/logger";

function getSingle(req) {
  return new Promise((resolve, reject) => {
    if (
      (req.query.token && req.query.token.length > 0) ||
      (req.body.text && req.body.text.length > 0)
    ) {
      const args = req.query.token || req.body.text;
      const apiUrl = "https://www.worldcoinindex.com/apiservice/ticker";
      const coin = args.substring(0, 3);
      // World Coin Index API Key, get your key from
      // https://www.worldcoinindex.com/apiservice/
      if (process.env.KL_WCI_API_KEY < 1) {
        logger.warn(
          "World Coin Index API key is missing, Please add an API key to the configuration file."
        );
        reject(
          "API Key is missing, Please add an API key to the configuration"
        );
      }
      const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${coin}btc&fiat=usd`;
      try {
        fetch(url).then((response) => {
          if (response.status === 200) {
            const json = response.body;
            const price = formatMoney(json.Markets[0].Price);
            const label = json.Markets[0].Label.substring(0, 3);
            const name = json.Markets[0].Name;
            const volume = formatMoney(json.Markets[0].Volume_24h);
            const lastTrade = formatPast(json.Markets[0].Timestamp);
            let returnString = `1 ${label} = ${price} USD as of ${lastTrade} ago\n\r`;
            returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
            returnString =
              returnString +
              `${name} https://www.worldcoinindex.com/coin/${name}`;
            resolve(returnString);
          }
        });
      } catch (error) {
        logger.error(error);
        reject("Are you trying to make me crash?");
      }
    } else {
      resolve(
        `Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth`
      );
    }
  });
}

export { formatPast, getSingle };
