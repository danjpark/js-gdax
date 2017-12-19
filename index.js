const Gdax = require('gdax');

const endpoint = "https://api.gdax.com"
const BTCUSD_publicClient = new Gdax.PublicClient('BTC-USD', endpoint);
const LTCUSD_publicClient = new Gdax.PublicClient('LTC-USD', endpoint);
const LTCBTC_publicClient = new Gdax.PublicClient('LTC-BTC', endpoint);
const ETHUSD_publicClient = new Gdax.PublicClient('ETH-USD', endpoint);

const orderbook = new Gdax.Orderbook();


const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

// publicClient.getProducts(callback);
const foo = async () => {
    let btcusd_book = await BTCUSD_publicClient.getProductOrderBook({'level':1});
    let ltcusd_book = await LTCUSD_publicClient.getProductOrderBook({'level':1});
    let ltcbtc_book = await LTCBTC_publicClient.getProductOrderBook({'level':1});

    let investment = 1000;
    let ltc_amt = investment / (ltcusd_book["asks"][0][0] * 1.0025);
    let btc_via_ltc_amt = ltc_amt * ltcbtc_book["bids"][0][0] * 0.99975;
    let pnl = btc_via_ltc_amt * btcusd_book["bids"][0][0] * 0.9975;

    console.log("########");
    console.log("intial investment: ", investment);
    console.log("amount of LTC i can buy: ", ltc_amt);
    console.log("amount of BTC i can buy with LTC: ", btc_via_ltc_amt);
    console.log("USD after i sell the BTC: ", pnl);
    // console.log("amount of LTC i can buy via BTC: ", ltc_via_btc_amt);
    // console.log("amount of $ i get after selling LTC: ", results);

    // let btc_amt = cost / btcusd_book["asks"][0][0];
    // let ltc_via_btc_amt = btc_amt / ltcbtc_book["asks"][0][0] * 1.0025;
    // let results = ltc_amt * ltcusd_book["bids"][0][0] * 0.9975

    // console.log(btcusd_book);
    // console.log(ltcusd_book);
    // console.log(ltcbtc_book);
}

const bar = async () => {
    let btcusd_trades = await BTCUSD_publicClient.getProductTrades();

    console.log(btcusd_trades);
}

foo();

// look at ltc/btc v the spread
// figure out which bid/ask to look at
