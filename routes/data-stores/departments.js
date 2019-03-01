const express = require('express')
const fb = require('node-firebird')
const request = require('request')
const config = require('../../config')

let dbOptions = config.company.origin

const router = express.Router()

// sample_bodies
router.get('/sample_bodies', function(req, res, next) {
	res.send({

		// body response for GET
		count: 0,

		// body request
		token: "TVRVd1lXSTFNRFl5WTJZM1kyRXhZalpqWW1ZelkyVTRPRGhoWVdNM01qQmxObUUwT1RReE5RPT0=", // base64 encoded zahir id access token
		skip: 0,
		origin: {
			// from zahir 5, zahir 6, and zahir online v1
			host: 'localhost',
			port: '3050',
			database: 'C:/Data Zahir/a.gdb',

			// from zahironline v2
			url: 'https://app.zahironline.com',
			slug: 'demo.zahironline.com',
		},
		destination: {

			// to zahironline v2
			url: 'https://app.zahironline.com',
			slug: 'demo.zahironline.com',
		},
		data: {
	    code: "string",
	    name: "string",
	    is_profit_center: true,
	    is_point_of_sale: true,
	    is_active: true,
	    parent: {
        code: "string",
        name: "string"
	    },
	    manager: {
        code: "string",
        name: "string"
	    },
	    warehouses: [
		      {
		        is_primary: true,
		        code: "string",
		        name: "string",
		        complete_address: "string",
		        district: "string",
		        city: "string",
		        state: "string",
		        country_code: "string",
		        country_name: "string",
		        postal_code: "string"
		      }
	    ],
	    addresses: [
	        {
	          is_primary: true,
	          type: "string",
	          complete_address: "string",
	          district: "string",
	          city: "string",
	          state: "string",
	          country_code: "string",
	          country_name: "string",
	          postal_code: "string",
	          latitude: 1,
	          longitude: 1
	        }
	    ],
	    phones: [
	        {
	          is_primary: true,
	          type: "string",
	          value: "string"
	        }
	    ],
	    emails: [
	        {
	          is_primary: true,
	          type: "string",
	          value: "string"
	        }
	    ],
	    contact_persons: [
	        {
	          is_primary: true,
	          type: "string",
	          designation: "string",
	          name: "string"
	        },
				]
			},
		// body response
		response: {}
	})
})

// get count
router.get('/', function(req, res, next) {

	// switch db with body request
	dbOptions = Object.assign(dbOptions, req.body.origin)

	// connect to db
	fb.attach(dbOptions, function(err, db) {
		if (err) {
			res.status(500).send({error: err})
		} else {

			// count
			let sql = 'select count(*) AS "count" from DEPT'

			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {
					res.send({count: result[0].count})
					db.detach()
				}
			})
		}
	})
})

// get one and post to destination company
router.post('/', function(req, res, next) {

	// switch db with body request
	dbOptions = Object.assign(dbOptions, req.body.origin)

	// connect to db
	fb.attach(dbOptions, function(err, db) {
		if (err) {
			res.status(500).send({error: err})
		} else {

			// get one
			let skip = req.body.skip || 0
			let sql = 'select first 1 skip '+skip
				+' 	"DEPTID" as "code", '
				+' 	"NAMA" as "name", '
				+' 	"IS_ACTIVE" as "is_active", '
				+'from '
				+' "DEPT"'
			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/departments',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							is_active: (result[0].is_active!=='T') ? true : false,
						},
						json: true
					}
					db.detach()

					request(reqOptions, function (error, response, body) {
						if (error) {
							res.status(500).send({error: error, data: reqOptions.body})
						} else {
							res.status(response.statusCode).send({data: reqOptions.body, response: body})
						}
					})
				}
			})
		}
	})
})

module.exports = router
