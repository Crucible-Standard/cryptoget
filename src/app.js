const logger = require('server-side-tools').logger;
const format = require('server-side-tools').format;
const sanitize = require('server-side-tools').sanitize;
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const moment = require('moment');
const request = require('superagent');
const pkjson = require('../package.json');

const app = express();

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

// adding helmet to enhance api security
app.use(helmet());

// using bodyParser to parse json bodies into js objects
app.use(bodyParser.json());

/** set up cors middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

logger.info('turning on app...');


/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.get('/', (req, res, next) => {
  if ((req.query.token) && req.query.token.length > 0) {
    const args = req.query.token;
    const apiUrl = 'https://www.worldcoinindex.com/apiservice/ticker';
    const coin = sanitize(args.substring(0, 3));
    // World Coin Index API Key, get your key from
    // https://www.worldcoinindex.com/apiservice/
    if (process.env.KL_WCI_API_KEY < 1) {
      logger.warn('World Coin Index API key is missing, Please add an API key to the configuration file.');
      res.status(403).send({ error: "API Key is missing, Please add an API key to the configuration" });
    }
    const url = `${apiUrl}?key=${process.env.KL_WCI_API_KEY}&label=${coin}btc&fiat=usd`;

    try {
      request.get(url).then((response) => {
        if (response.status === 200) {
          const json = response.body;
          if (typeof json.Markets === 'undefined' || typeof json.error !== 'undefined') {
            logger.error(`undefined in json.markets: ${json.error}`);
            res.status(400).send({ error: 'Are you trying to make me crash?' });
          } else {
            const price =  format.formatMoney(json.Markets[0].Price);
            const label = json.Markets[0].Label.substring(0, 3);
            const name = json.Markets[0].Name;
            const volume = format.formatMoney(json.Markets[0].Volume_24h);
            const lastTrade = formatPast(json.Markets[0].Timestamp);
            let returnString = `1 ${label} = ${price} USD as of ${lastTrade} ago\n\r`;
            returnString = returnString + `24 Hour Volume ${volume} USD\n\r`;
            returnString = returnString + `${name} https://www.worldcoinindex.com/coin/${name}`;
            res.status(200).send({ data: returnString });
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).send({ error: 'Are you trying to make me crash?' });
    }
  } else {
  res.status(200).send({ data: `Please use the endpoint with a get param of 'token'. example https://cryptoget.herokuapp.com/?token=eth` });
  }
});

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.get('/health', (req, res, next) => {
  const time = process.uptime();
  const uptime = format.toDDHHMMSS(time + '');
  res.status(200).send({ data: {uptime: uptime, version: pkjson.version} });
});

// heroku dynamically assigns your app a port, so you can't set the port to a fixed number.
const server = app.listen(process.env.PORT || 5000, function () {
  const host = server.address().address;
  const port = server.address().port;

  logger.info(`app listening at http://${host}:${port}`);
});

module.exports = server;
