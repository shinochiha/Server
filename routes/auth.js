const express = require('express')
const request = require('request')
const config = require('../config')
const router = express.Router()

router.post('/', function(req, res, next) {
  let userAgent = req.get('User-Agent')
  let token = req.get('Authorization').split(' ')
  let credential = Buffer.from(token[1], 'base64').toString().split(':')
  let options = {
    method: 'POST',
    url: config.zahir_id.url+'/oauth/access_token',
    headers: {
      'User-Agent': userAgent,
    },
    formData: {
      grant_type: 'password',
      client_id: config.zahir_id.client_id,
      client_secret: config.zahir_id.client_secret,
      username: credential[0],
      password: credential[1],
    },
  }
  request(options, function (error, response, body) {
    if (error) {
      res.status(500).send(error)
    } else if (response.statusCode<200 || response.statusCode>=300) {
      res.status(response.statusCode).send(body)
    } else {
      res.status(response.statusCode).send({token: Buffer.from(JSON.stringify(body)).toString('base64')})
    }
  })
})

module.exports = router
