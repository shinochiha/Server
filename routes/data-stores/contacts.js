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
			bussiness_id_number: "string",
			tax_id_number: "string",
			is_customer: true,
			is_supplier: true,
			is_employee: true,
			is_active: true,
			credit_limit: 1,
			term_of_payment: {
				due_days: 1,
				late_charge: 1,
				discount_days: 1,
				early_discount: 1
			},
			classification: {
				name: "string"
			},
			default_currency: {
				code: "string",
				name: "string",
				symbol: "string"
			},
		},

		// body response
		response: {}
	})
})

// get count
router.get('/', function(req, res, next) {

	// switch db with body request
	dbOptions = Object.assign(dbOptions, {database: req.get('database')})

	// connect to db
	fb.attach(dbOptions, function(err, db) {
		if (err) {
			res.status(500).send({error: err})
		} else {

			// count
			let sql = 'select count(*) AS "count" from "CARDFILE" as "C" join "KLASCARD" as "K" on "C"."KLASIFIKASI" = "K"."NOINDEX" join "KURSMSTR" as "KM" on "KM"."KURS" = "C"."KURS"'
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
				+' 	"C"."KODE" as "code", '
				+' 	"C"."PERUSAHAAN" as "name", '
				+' 	"C"."BUSINESS_ID_NUMBER" as "bussiness_id_number", '
				+' 	"C"."TAX_ID_NUMBER" as "tax_id_number", '
				+' 	"C"."IS_CUSTOMER" as "is_customer", '
				+' 	"C"."IS_SUPPLIER" as "is_supplier", '
				+' 	"C"."IS_EMPLOYEE" as "is_employee", '
				+' 	"C"."IS_ACTIVE" as "is_active", '
				+' 	"C"."BATASKREDIT" as "credit_limit", '
				+' 	"C"."DUEDAYS" as "due_days", '
				+' 	"C"."LATECHARGE" as "late_charge", '
				+' 	"C"."DISCOUNT_DAYS" as "discount_days", '
				+' 	"C"."EARLYDISCOUNT" as "early_discount", '
				+' 	"C"."KLASIFIKASI" as "class_name", '
				+' 	"KM"."KURS" as "currency_code", '
				+' 	"KM"."NAMA" as "currency_name", '
				+' 	"KM"."SIMBOL" as "currency_symbol", '
				+'from '
				+'	"CARDFILE" as "C" '
				+' 	join "KLASCARD" as "K" on "C"."KLASIFIKASI" = "K.NOINDEX" '
				+'	join "KURSMSTR" as "KM" on "KM"."KURS" = "C"."KURS"'

			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/contacts',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							bussiness_id_number: result[0].bussiness_id_number,
							tax_id_number: result[0].tax_id_number,
							is_customer: (result[0].is_customer==='T') ? true : false,
							is_supplier: (result[0].is_supplier!=='T') ? true : false,
							is_employee: (result[0].is_employee!=='T') ? true : false,
							is_active: (result[0].is_active!=='T') ? true : false,
							credit_limit: result[0].credit_limit,
							term_of_payment: {
								due_days: result[0].due_days,
								late_charge: result[0].late_charge,
								discount_days: result[0].discount_days,
								early_discount: result[0].early_discount,
							},
							classification: {
								name: result[0].class_name,
							},
							default_currency: {
								code: result[0].currency_code,
								name: result[0].currency_name,
								symbol: result[0].currency_symbol,
							}
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
