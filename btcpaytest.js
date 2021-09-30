/*
 * TEST invoicing and payment functions for BTCPayserver
 * See https://docs.btcpayserver.org/API/Greenfield/v1/ for full API
 * run with node btcpaytest.js
 */

require("dotenv").config();
const readline = require('readline');
const lightningPayReq = require('bolt11')
const axios = require('axios');
const apitoken = process.env.APITOKEN
const baseURL = 'https://pay.elephantthink.com'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please send me a valid Bolt11 invoice: ', (bolt11) => {
    //decode the invoice to check the amount
    try {
        const decoded = lightningPayReq.decode(bolt11)
        console.log(decoded)
        if (decoded.millisatoshis <= 2000) 
            //pay the invoice    
            pay(bolt11)
        else console.log('send payment less than 2 sat')
    } catch(e) {
        console.log('not a valid bolt11 invoice')
    }

    // now lets ask for an invoice of 1000 sats
    invoice("1000")
    rl.close();
});



async function pay(bolt11){
    try {
         const res = await axios({
             method: 'post',
             url: baseURL+'/api/v1/server/lightning/BTC/invoices/pay',
             data: {
                 "BOLT11": bolt11
             },
             headers: {
                 'Authorization' : 'token '+apitoken
             }
         })
         console.log(res.statusText)
     } catch (error) {
         console.log(`Error in invoice payment:${error}`)
     }
     
  }

  async function invoice(amount){
    try {
         const res = await axios({
             method: 'post',
             url: baseURL+'/api/v1/server/lightning/BTC/invoices',
             data: {
                "amount": amount,
                "description": "This is a test invoice",
                "expiry": 300,
                "privateRouteHints": false
             },
             headers: {
                 'Authorization' : 'token '+apitoken
             }
         })
         console.log(res.data.BOLT11)
     } catch (error) {
         console.log(`Error in invoice generation:${error}`)
     }
     
  }