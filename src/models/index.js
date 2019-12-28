const request = require('superagent');
const logger = require('server-side-tools').logger;
const format = require('server-side-tools').format;
const sanitize = require('server-side-tools').sanitize;
const moment = require('moment');


/**
 * formatPast
 * takes a time stamp from the past and calculates the hh:mm:ss it was in the past
 * @param {string} intDate - a time stamp in the past in seconds
 */
function formatPast(intDate) {
  const timestamp = moment.unix(intDate);
  const now = moment.unix(new Date().getTime() / 1000);
  const difference = now.diff(timestamp);
  const duration = moment.duration(difference);
  return Math.floor(duration.asHours()) + moment.utc(difference).format(':mm:ss');
}

function getSingle (req) {
  return new Promise((resolve, reject) => {
    if (((req.query.token) && req.query.token.length > 0) || ((req.body.text) && req.body.text.length > 0)) {
      const args = req.query.token || req.body.text;
      const apiUrl = 'https://www.worldcoinindex.com/apiservice/ticker';
      const coin = sanitize(args.substring(0, 3));
      // World Coin Index API Key, get your key from
      // https://www.worldcoinindex.com/apiservice/
      if (process.env.KL_WCI_API_KEY < 1) {
        logger.warn('World Coin Index API key is missing, Please add an API key to the configuration file.');
        reject('API Key is missing, Please add an API key to the configuration');
      }
      const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${coin}btc&fiat=usd`;
      try {
        request.get(url).then((response) => {
          if (response.status === 200) {
            const json = response.body;
            if (typeof json.Markets === 'undefined' || typeof json.error !== 'undefined') {
              logger.error(`undefined in json.markets: ${json.error}`);
              reject('Are you trying to make me crash?');
            } else {
              const price =  format.formatMoney(json.Markets[0].Price);
              const label = json.Markets[0].Label.substring(0, 3);
              const name = json.Markets[0].Name;
              const volume = format.formatMoney(json.Markets[0].Volume_24h);
              const lastTrade = formatPast(json.Markets[0].Timestamp);
              let returnString = `1 ${label} = ${price} USD as of ${lastTrade} ago\n\r`;
              returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
              returnString = returnString + `${name} https://www.worldcoinindex.com/coin/${name}`;
              resolve(returnString);
            }
          }
        });
      } catch (error) {
        logger.error(error);
        reject('Are you trying to make me crash?');
      }
    } else {
      resolve(`Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth`);
    }
  });
  }

module.exports = {formatPast, getSingle}
