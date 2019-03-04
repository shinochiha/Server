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
			complete_address: "string",
			district: "string",
			city: "string",
			state: "string",
			country_code: "string",
			country_name: "string",
			postal_code: "string",
			is_primary: true,
			is_active: true,
			department: {
				code: "string",
				name: "string"
			},
			phones: [
				{
						is_primary: true,
						type: "string",
						value: "string"
				}
			],
			emails: [
				{
						id: "4e0c0a23-7349-4d94-977f-f0e34a977e81",
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
				}
			],
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
			let sql = 'select count(*) AS "count" from GUDANG '

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
				+' "KODEGUDANG" as "code", '
				+' "NAMA_GUDANG" as "name", '
				+' "ALAMAT_1" as "complete_address", '
				+' "ALAMAT_2" as "district", '
				+' "KOTA" as "city", '
				+' "STATE" as "state", '
				+' "COUNTRY_CODE" as "country_code", '
				+' "COUNTRY_NAME" as "country_name", '
				+' "KODEPOS" as "postal_code", '
				+' "IS_PRIMARY" as "is_primary", '
				+' "IS_ACTIVE" as "is_active", '
				+'from "GUDANG"'
			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/warehouses',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							complete_address: result[0].complete_address,
							district: result[0].district,
							city: result[0].city,
							state: result[0].state,
							country_code: result[0].country_code,
							country_name: result[0].country_name,
							postal_code: result[0].postal_code,
							is_primary: (result[0].is_primary==='T') ? true : false,
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
