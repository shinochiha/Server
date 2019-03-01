const express = require('express')
const request = require('request')
const config = require('../config')
const router = express.Router()

router.post('/', function(req, res, next) {
  let token = req.get('Authorization').split(' ');
  let credential = Buffer.from(token[1], 'base64').toString().split(':')
  let options = {
    method: 'POST',
    url: config.zahir_id.url+'/oauth/access_token',
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
    } else if (response.statusCode!==200) {
      res.status(response.statusCode).send(body)
    } else {
      res.status(response.statusCode).send({token: Buffer.from(JSON.stringify(body)).toString('base64')})
    }
  })

  // yg ini copas dari postman, barangkali butuh untuk ngecek kenapa kalo login nya berhasil response zahir id nya error
  // var options = { method: 'POST',
  //   url: 'https://zahir-id.zahironline.com/oauth/access_token',
  //   headers:
  //    { 'cache-control': 'no-cache',
  //      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  //   formData:
  //    { grant_type: 'password',
  //      client_id: 'd34ab169b70c9dcd35e62896010cd9ff',
  //      client_secret: '75096e3787',
  //      username: 'rnd.zahir@gmail.com',
  //      password: '123456m' } };

  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);

  //   res.send(body);
  // });
})

module.exports = router
