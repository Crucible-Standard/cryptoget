import fetch from "node-fetch";

import { formatMoney, formatPast } from "../utils/format";
import { default as logger } from "../utils/logger";

interface ResponseData {
  name: string;
  message: string;
  price: string;
  volume: string;
  lastTrade: string;
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

/**
 * getSingle
 * @description Get price of a single Crypto token in USD based on last trade value from WorldCoinIndex
 * @param {string} token - 3 letter crypto token name (BTC, ETH, LTC, etc)
 * @returns {<Promise<CryptoGetResponse>>} price of token in USD
 **/
async function getSingle(token: string): Promise<CryptoGetResponse> {
  logger.info(`${token} requested`);
  const apiUrl = "https://www.worldcoinindex.com/apiservice/ticker";
  const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${token}btc&fiat=usd`;
  try {
    const response = await fetch(url);
    const data: any = await response.json();
    logger.info(JSON.stringify(data));
    const unformatted_price = data.Markets[0].Price;
    const price: string = unformatted_price.toFixed(2);
    const label = data.Markets[0].Label.substring(0, 3);
    const name = data.Markets[0].Name;
    const volume = formatMoney(data.Markets[0].Volume_24h);
    const lastTrade = formatPast(data.Markets[0].Timestamp);
    let returnString = `1 ${label} = ${price} USD as of ${lastTrade} ago\n\r`;
    returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
    returnString =
      returnString + `${name} https://www.worldcoinindex.com/coin/${name}`;

    return new Promise((resolve, reject) => {
      resolve({
        data: {
          message: returnString,
          price: price,
          volume: volume,
          lastTrade: lastTrade,
          name: name,
          token: label,
        },
        meta: {
          status: 200,
        },
      });
    });
  } catch (error) {
    logger.error(error);
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          message: "Are you sure that is a valid token?",
          price: "0",
          token: token,
          volume: "",
          lastTrade: "",
          name: "",
        },
        meta: {
          status: 200,
        },
      });
    });
  }
}

/**
 * getSingleSlack
 * @description Get price of a single Crypto token in USD based on last trade value from WorldCoinIndex
 * @param {string} token 3 letter crypto token name (BTC, ETH, LTC, etc)
 * @returns {<Promise<CryptoGetSlackResponse>>} price of token in USD
 **/
async function getSingleSlack(token: string): Promise<CryptoGetSlackResponse> {
  const apiUrl = "https://www.worldcoinindex.com/apiservice/ticker";
  const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${token}btc&fiat=usd`;
  try {
    const response = await fetch(url);
    const data: any = await response.json();
    const unformatted_price = data.Markets[0].Price;
    const price = formatMoney(unformatted_price);
    const label = data.Markets[0].Label.substring(0, 3);
    const name = data.Markets[0].Name;
    const volume = formatMoney(data.Markets[0].Volume_24h);
    const lastTrade = formatPast(data.Markets[0].Timestamp);
    let returnString = `1 ${label} = ${price} USD as of ${lastTrade} ago\n\r`;
    returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
    returnString =
      returnString + `${name} https://www.worldcoinindex.com/coin/${name}`;
    return {
      response_type: "in_channel",
      text: returnString,
    };
  } catch (error) {
    logger.error(error);
    return {
      response_type: "in_channel",
      text: "Are you trying to make me crash?",
    };
  }
}

export { getSingleSlack, getSingle };
