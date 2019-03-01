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
			id: "5f7d4c44-67fc-41fd-b35e-8492d4f0ad43",
			status: "string",
			date: "2019-03-01",
			time: "string",
			number: "string",
			description: "string",
			supplier: {
					id: "df7fd309-1965-47d4-a40b-9762cb0bcdc8",
					code: "string",
					name: "string",
					classification: {
							id: "1e57375b-f5ba-41c8-8497-45555d999ae8",
							name: "string"
					}
			},
			orders: [
					{
							id: "9ca153f6-603d-44f8-9bc6-2b563a8dff93",
							date: "2019-03-01",
							number: "string",
							description: "string"
					}
			],
			employees: [
					{
							id: "ccbc3344-6612-4058-8609-9a549c38226b",
							type: {
									id: "string",
									name: "string"
							},
							contact: {
									id: "efa616a9-6a8e-4898-af5d-8b7b30c51c5a",
									code: "string",
									name: "string",
									classification: {
											id: "87bf5a8c-7448-470d-915b-8bee233c8edc",
											name: "string"
									}
							}
					}
			],
			department: {
					id: "30d18369-9f8d-416f-9656-5419c436e517",
					code: "string",
					name: "string"
			},
			project: {
					id: "ab193bd3-c3de-4083-9b66-d8869e22d303",
					code: "string",
					name: "string"
			},
			document: {
					date: "2019-03-01",
					number: "string"
			},
			tax_form: {
					date: "2019-03-01",
					number: "string"
			},
			other_fields: [
					{
							id: "13ee0b9b-a43f-4829-838a-64c7c4a6752d",
							key: "string",
							type: "string",
							name: "string"
					}
			],
			amount_type: "string",
			account: {
					id: "aaae66d9-620c-4eee-9e19-3a8f5bfde126",
					code: 1,
					name: "string",
					alias_name: "string"
			},
			currency: {
					id: "4c93c96a-faba-4061-964b-5d85c7e19b29",
					code: "string",
					name: "string",
					symbol: "string"
			},
			exchange_rate: 1,
			amount_origin: 1,
			amount: 1,
			taxes: [
					{
							id: "ca71e92c-7646-447e-aace-e07f79aba231",
							code: "string",
							name: "string",
							rate: 1
					}
			],
			total_amount_origin: 1,
			total_amount: 1,
			balance_origin: 1,
			balance: 1,
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
			let sql = 'select count(*) AS "count" from TAX '

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
				+' 	"K"."KODE" as "code", '
				+' 	"K"."NAMA" as "name", '
				+' 	"K"."ALIASNAMA" as "alias_name", '
				+' 	"K"."CHECKING" as "is_cash", '
				+' 	"K"."NOTACTIVE" as "is_active", '
				+' 	"C"."KURS" as "currency_code", '
				+' 	"C"."NAMA" as "currency_name", '
				+' 	"C"."SIMBOL" as "currency_symbol", '
				+' 	"S"."NOSUBKLASIFIKASI" as "subclass_code", '
				+' 	"S"."NAMASUBKLASIFIKASI" as "subclass_name", '
				+' 	"S"."ALIASSUBKLASIFIKASI" as "subclass_alias_name", '
				+' 	"KL"."NOKLASIFIKASI" as "class_code", '
				+' 	"KL"."NAMAKLASIFIKASI" as "class_name", '
				+' 	"KL"."ALIASKLASIFIKASI" as "class_alias_name" '
				+'from '
				+'	"KIRAAN" as "K" '
				+'	join "KURSMSTR" as "C" on "C"."KURS" = "K"."KURS"'
				+'	join "SUBKLAS" as "S" on "S"."NOSUBKLASIFIKASI" = "K"."NOSUBKLASIFIKASI"'
				+'	join "KLAS" as "KL" on "KL"."NOKLASIFIKASI" = "S"."NOKLASIFIKASI"'
			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/purchases_prepayment_beginning_balances',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							alias_name: result[0].alias_name,
							is_cash: (result[0].is_cash==='T') ? true : false,
							is_active: (result[0].is_active!=='T') ? true : false,
							currency: {
								code: result[0].currency_code,
								name: result[0].currency_name,
								symbol: result[0].currency_symbol,
							},
							subclassification: {
								code: result[0].subclass_code,
								name: result[0].subclass_name,
								alias_name: result[0].subclass_alias_name,
							},
							classification: {
								code: result[0].class_code,
								name: result[0].class_name,
								alias_name: result[0].class_alias_name,
							},
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
