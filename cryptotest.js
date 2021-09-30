const crypto = require('crypto')
const secret = "4Wxx6BJQkHY2dRzPGZSAjvPYBNzB";
const sigHeaderName = 'x-hub-signature-256'
const sigHashAlg = 'sha256'
const hmac = crypto.createHmac(sigHashAlg, secret)
console.log(hmac)