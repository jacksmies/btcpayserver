/*
 * Simple invoice charging API example
 * run with node chargestream.js
 */
require("dotenv").config();
const charge  = require('lightning-charge-client')('https://testpay.elephantthink.com/lightning-charge/btc/', process.env.LCTOKEN)

async function init(){
    // create a test invoice for 10 sats
    const inv = await charge.invoice({ description: `Testing for 10 sats`, 
    currency: 'USD', amount: 1, metadata: { customer_id: 123, product_id: 456 } })
    console.log(inv.payreq)
}

const stream = charge.stream()
stream.on('payment', inv => {
  // payment received
  console.log(`invoice ${ inv.id } of ${ inv.msatoshi } paid`)
})

init()