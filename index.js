const Gdax = require('gdax');


const publicClient = new Gdax.PublicClient();
const orderbook = new Gdax.Orderbook();

const callback = function(err, response, data) {
    if(err) return console.error(err)
    // console.log(data.bids);
    something(data.bids);
};

const something = function(data){
// takes an array of arrays
// i want to see the one id with the largest amount of orders in the books
    let data2 = [[1, 2, 'dan'],[1, 23, 'dan'],
                [2, 24, 'dan'],[1, 2, 'jim'],
                [3, 34, 'jim'],[1, 2, 'fax'],]

    let dan = data.reduce((a, b) =>  {
        const [price,size,id] = b;
        a[id] = a[id] ? a[id] + 1 : 1
        return a;
    }, {})

    let filterObj = Object.keys(dan).reduce((a, b) => {
        console.log(b);
        if (dan[b] > 1){
            console.log(b, dan[b]);
        }
        return a;
    }, {})

    console.log(filterObj);
};

//publicClient.getProducts(callback)
publicClient.getProductOrderBook({'level':3}, callback)
