const Gdax = require('gdax');
const { roundUp, roundDown, displayTime } = require('./helper');
const CONFIG = require('./config.json');


const endpoint = "https://api.gdax.com"
const BTCUSD_publicClient = new Gdax.PublicClient('BTC-USD', endpoint);
const LTCUSD_publicClient = new Gdax.PublicClient('LTC-USD', endpoint);
const LTCBTC_publicClient = new Gdax.PublicClient('LTC-BTC', endpoint);
const ETHUSD_publicClient = new Gdax.PublicClient('ETH-USD', endpoint);

const arb_algo = async () => {
    try {
        let btcusd_book = await BTCUSD_publicClient.getProductOrderBook({'level':1});
        let ltcusd_book = await LTCUSD_publicClient.getProductOrderBook({'level':1});
        let ltcbtc_book = await LTCBTC_publicClient.getProductOrderBook({'level':1});


        if(btcusd_book.message) return console.log(btcusd_book.message);
        if(ltcusd_book.message) return console.log(ltcusd_book.message);
        if(ltcbtc_book.message) return console.log(ltcbtc_book.message);

        let investment = 1000;
        let ltc_amt = investment / (ltcusd_book["asks"][0][0] * 1.0025);
        let btc_via_ltc_amt = ltc_amt * ltcbtc_book["bids"][0][0] * 0.99975;
        let pnl1 = roundDown(btc_via_ltc_amt * btcusd_book["bids"][0][0] * 0.9975, 2);

        // console.log("########");
        // console.log("intial investment: ", investment);
        // console.log("amount of LTC i can buy: ", ltc_amt);
        // console.log("amount of BTC i can buy with LTC: ", btc_via_ltc_amt);
        // console.log("USD after i sell the BTC: ", pnl1);

        let btc_amt = investment / (btcusd_book["asks"][0][0] * 1.0025);
        let ltc_via_btc_amt = btc_amt / ltcbtc_book["asks"][0][0] * 1.0025;
        let pnl2 = roundDown(ltc_via_btc_amt * ltcusd_book["bids"][0][0] * 0.9975, 2);

        // console.log("\n########");
        // console.log("intial investment: ", investment);
        // console.log("amount of BTC i can buy: ", btc_amt);
        // console.log("amount of LTC i can buy with BTC: ", ltc_via_btc_amt);
        // console.log("USD after i sell the LTC: ", pnl2);

        if(pnl1 > investment) total_pnl = total_pnl + (pnl1 - investment);
        if(pnl2 > investment) total_pnl = total_pnl + (pnl2 - investment);

        console.log(displayTime(),
                    pnl1,
                    pnl2,
                    total_pnl);
    } catch(e) {
        console.log(e);
    }

}

const bar = async () => {
    let btcusd_trades = await BTCUSD_publicClient.getProductTrades();

    console.log(btcusd_trades);
}

let total_pnl = 0;
setInterval(arb_algo, 1500);

// look at ltc/btc v the spread
// figure out which bid/ask to look at
