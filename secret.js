/*
 * verify secret from BTCPayserver webhook
 */

const crypto = require('crypto')
const express = require('express')

const secret = "4Wxx6BJQkHY2dRzPGZSAjvPYBNzB";

// For these headers, a sigHashAlg of sha1 must be used instead of sha256
// GitHub: X-Hub-Signature
// Gogs:   X-Gogs-Signature
const sigHeaderName = 'x-hub-signature-256'
const sigHashAlg = 'sha256'

const app = express()
// Saves a valid raw JSON body to req.rawBody
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  },
}))

function verifyPostData(req, res, next) {
  if (!req.rawBody) {
    return next('Request body empty')
  }

  const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
  const hmac = crypto.createHmac(sigHashAlg, secret)
  const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`)
  }

  return next()
}

app.post('/', verifyPostData, function (req, res) {
    var body = req.body;
    console.log(body);
    res.status(200).send('Request body was signed')
})

app.use((err, req, res, next) => {
  if (err) console.error(err)
  res.status(403).send('Request body was not signed or verification failed')
})

app.listen(3000, () => console.log("Listening on port 3000"))