const Gdax = require('gdax');


const BTCUSD_publicClient = new Gdax.PublicClient('BTC-USD');
const LTCUSD_publicClient = new Gdax.PublicClient('LTC-USD');
const LTCBTC_publicClient = new Gdax.PublicClient('LTC-BTC');

const orderbook = new Gdax.Orderbook();


// publicClient.getProducts(callback);
const bar = async function(){
    let foo = await BTCUSD_publicClient.getProductOrderBook({'level':1});
    console.log(foo);
}

bar();
// look at ltc/btc v the spread
// figure out which bid/ask to look at
