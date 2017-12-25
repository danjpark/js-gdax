const GDAX = require('gdax');
const { roundUp, roundDown, displayTime } = require('./helper');
const CONFIG = require('./config.json');

const BTCUSD_publicClient = new GDAX.PublicClient('BTC-USD', CONFIG.apiURI);
const LTCUSD_publicClient = new GDAX.PublicClient('LTC-USD', CONFIG.apiURI);
const LTCBTC_publicClient = new GDAX.PublicClient('LTC-BTC', CONFIG.apiURI);
const ETHUSD_publicClient = new GDAX.PublicClient('ETH-USD', CONFIG.apiURI);
const BCHUSD_publicClient = new GDAX.PublicClient('BCH-USD', CONFIG.apiURI);
const authedClient = new GDAX.AuthenticatedClient(CONFIG.apiKey,
                                                  CONFIG.base64secret,
                                                  CONFIG.passPhrase,
                                                  CONFIG.apiURI);

const arb_algo_theo = async () => {
    try {
        let usdbtc_book = await BTCUSD_publicClient.getProductOrderBook({'level':1});
        let usdltc_book = await LTCUSD_publicClient.getProductOrderBook({'level':1});
        let btcltc_book = await LTCBTC_publicClient.getProductOrderBook({'level':1});


        if(usdbtc_book.message) return console.log(usdbtc_book.message);
        if(usdltc_book.message) return console.log(usdltc_book.message);
        if(btcltc_book.message) return console.log(btcltc_book.message);

        let investment = 75;

        // USD -> LTC -> BTC -> USD
        let ltc_amt = investment / (usdltc_book["asks"][0][0] * 1.0025);
        let btc_via_ltc_amt = ltc_amt * btcltc_book["bids"][0][0] * 0.99975;
        let pnl1 = roundDown(btc_via_ltc_amt * usdbtc_book["bids"][0][0] * 0.9975, 2);

        // USD -> BTC -> LTC -> USD
        let btc_amt = investment / (usdbtc_book["asks"][0][0] * 1.0025);
        let ltc_via_btc_amt = btc_amt / btcltc_book["asks"][0][0] * 1.0025;
        let pnl2 = roundDown(ltc_via_btc_amt * usdltc_book["bids"][0][0] * 0.9975, 2);

        if(pnl1 > investment) total_pnl = total_pnl + (pnl1 - investment);
        if(pnl2 > investment) total_pnl = total_pnl + (pnl2 - investment);

        console.log(displayTime(),
                    pnl1,
                    pnl2,
                    total_pnl);
    } catch(e) {
        console.log(e);
    }
};

const test_live = async () => {
    let epsilon = 50.10;

    try{
        let usdbtc_book = await BTCUSD_publicClient.getProductOrderBook({'level':1});
        let usdltc_book = await LTCUSD_publicClient.getProductOrderBook({'level':1});
        let btcltc_book = await LTCBTC_publicClient.getProductOrderBook({'level':1});
        if(usdbtc_book.message) return console.log(usdbtc_book.message);
        if(usdltc_book.message) return console.log(usdltc_book.message);
        if(btcltc_book.message) return console.log(btcltc_book.message);

        let availableUSD = (await authedClient.getAccount(CONFIG.USDAccountID)).available;
        availableUSD = 1000

        // USD -> LTC -> BTC -> USD
        let pnl1 = roundDown(availableUSD
                                * (btcltc_book["bids"][0][0] * 0.9975)
                                * (usdbtc_book["bids"][0][0] * 0.9975)
                                / (usdltc_book["asks"][0][0] * 1.0025)
                            , 2);


        // USD -> BTC -> LTC -> USD
        let pnl2 = roundDown(availableUSD
                                / (usdbtc_book["asks"][0][0] * 1.0025)
                                / (btcltc_book["asks"][0][0] * 1.0025)
                                * (usdltc_book["bids"][0][0] * 0.9975)
                            , 2);

        console.log(displayTime());
        console.log(availableUSD, pnl1);
        console.log(availableUSD, pnl2);
        console.log("");
        //
        // if(pnl1 - availableUSD > epsilon) {
        //     console.log("###### Buying LTC with USD");
        //     let USDtoLTC = await authedClient.buy({
        //         type: "limit",
        //         price: usdltc_book["asks"][0][0].toString(),
        //         size: (availableUSD / usdltc_book["asks"][0][0]).toString(),
        //         product_id: "LTC-USD",
        //         time_in_force  : "FOK",
        //         post_only: false
        //     })
        //     console.log(USDtoLTC);
        // }
        if(pnl2 - availableUSD > epsilon) {
            console.log("starting here:", availableUSD);
            console.log("##### 1 Buying BTC with USD");
            let USDtoBTC = await authedClient.buy({
                type: "limit",
                price: (usdbtc_book["asks"][0][0]).toString(), // USD string
                size: (roundDown(availableUSD / (usdbtc_book["asks"][0][0]), 4)).toString(), // BTC string
                product_id: "BTC-USD",
                time_in_force  : "FOK",
                post_only: false
            })

            let fill_size = (await authedClient.getOrder(USDtoBTC.id)).filled_size;
            // if the previous trade was successful. look up what the fill size is
            console.log("##### 2 BUYING LTC WITH BTC");
            let BTCtoLTC = await authedClient.buy({
                type: "limit",
                price: (btcltc_book["asks"][0][0]).toString(),
                size: roundDown(fill_size / btcltc_book["asks"][0][0], 8).toString(),
                product_id: "LTC-BTC",
                time_in_force: "FOK",
                post_only: false
            })
            console.log(BTCtoLTC);

            fill_size = (await authedClient.getOrder(BTCtoLTC.id)).filled_size;
            console.log("####### 3 BUYING USD WITH LTC");
            let LTCtoUSD = await authedClient.sell({
                type: "limit",
                price: (usdltc_book["bids"][0][0]).toString(),
                size: fill_size.toString(),
                product_id: "LTC-USD",
                time_in_force: "FOK",
                post_only: false
            })

            let final = await authedClient.getOrder(LTCtoUSD.id);
            console.log(final);

            console.log("ending with : ", );
        }
    } catch(e){
        console.log(e);
    }
}

//let total_pnl = 0;
//setInterval(arb_algo_theo, 1500);

setInterval(test_live, 1.5 * 1000);
//test_live();
