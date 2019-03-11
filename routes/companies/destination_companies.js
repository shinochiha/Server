const express = require('express')
const request = require('request')
const config = require('../../config')
const router = express.Router()

router.get('/', function(req, res, next) {
  let authorization = req.get('Authorization')
  let destType = req.get('destination_type')
  let destUrl = req.get('destination_url')
  let company_url = ''
  if (destType==='subscribe') {
    company_url = config.company.destination.url+'/api/v2/user_companies'
  } else {
    company_url = destUrl+'/api/v2/companies'
  }
console.log(req.query)
  let options = {
    method: 'GET',
    url: company_url,
    headers: {
      'Authorization': authorization,
    },
    qs: req.query
  }
  request(options, function (error, response, body) {
    if (error) {
      res.status(500).send(body)
    } else {
      res.status(response.statusCode).send(body)
    }
  })
})
module.exports = router
