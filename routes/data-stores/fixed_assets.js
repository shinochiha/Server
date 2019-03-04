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
			 description: "string",
			 location: "string",
			 category: {
					 name: "string"
			 },
			 depreciation: {
					 method: "string",
					 useful_life_in_year: 1,
					 useful_life_in_period: 1,
					 is_after_15_start_next_month: true,
					 acquired_date: "2019-02-28",
					 acquired_value: 1,
					 salvage_value: 1,
					 last_depreciation_value: 1,
					 last_accumulated_depreciation_value: 1,
					 last_book_value: 1
			 },
			 default_account: {
					 asset: {
							 code: "string",
							 name: "string"
					 },
					 accumulated_depreciation: {
							 code: "string",
							 name: "string"
					 },
					 depreciation: {
							 code: "string",
							 name: "string"
					 },
					 gain_on_sales: {
							 code: "string",
							 name: "string"
					 },
					 loss_on_sales: {
							 code: "string",
							 name: "string"
					 }
			 },
			 department: {
					 code: "string",
					 name: "string"
			 },
			 transaction_in: {
					 date: "2019-02-28",
					 number: "string",
					 description: "string"
			 },
			 transaction_out: {
					 date: "2019-02-28",
					 number: "string",
					 description: "string"
			 },
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
			let sql = 'select count(*) AS "count" from ASSET as A join DEPT as D on A.DEPT = D.NOINDEX join ASSET_CATEGORY as C on C.NOINDEX = A.KELOMPOK'

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
				+' 	"A"."KODE" as "code", '
				+' 	"A"."NAMA" as "name", '
				+' 	"A"."KETERANGAN" as "description", '
				+' 	"A"."LOKASI" as "location", '
				+' 	"S"."NAMA" as "category_name", '
				+' 	"A"."METHOD" as "method", '
				+' 	"A"."UMUR_EKONOMIS" as "useful_life_in_year", '
				+' 	"A"."USEFUL_LIFE_IN_PERIOD" as "useful_life_in_period", '
				+' 	"A"."IS_AFTER15_START_NEXT" as "is_after_15_start_next_month", '
				+' 	"A"."TANGGAL_PEROLEHAN" as "acquired_date", '
				+' 	"A"."NILAI_PEROLEHAN" as "acquired_value", '
				+' 	"A"."NILAI_RESIDU" as "salvage_value", '
				+' 	"A"."BEBAN_PERBULAN" as "last_depreciation_value", '
				+' 	"A"."AKUMULASI_BEBAN" as "last_accumulated_depreciation_value", '
				+' 	"A"."NILAI_BUKU" as "last_book_value", '
				+' 	"A"."KODE" as "asset_code", '
				+' 	"A"."NAMA" as "asset_name", '
				+' 	"K"."KODE" as "accumulated_depreciation_code", '
				+' 	"K"."NAMA" as "accumulated_depreciation_name", '
				+' 	"K"."KODE" as "depreciation_code", '
				+' 	"K"."NAMA" as "depreciation_name", '
				+' 	"K"."KODE" as "gain_on_sales_code", '
				+' 	"K"."NAMA" as "gain_on_sales_name", '
				+' 	"K"."KODE" as "loss_on_sales_code", '
				+' 	"K"."NAMA" as "loss_on_sales_name", '
				+' 	"D"."DEPTID" as "department_code", '
				+' 	"D"."NAMA" as "department_name", '
				+'from '
				+'	"ASSET" as "A" '
				+'	join "DEPT" as "D" '
				+'	join "ASSET_CATEGORY" as "S" '
			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/fixed_assets',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							description: result[0].description,
							location: result[0].location,
							category: {
								name: result[0].category_name,
							},
							depreciation: {
								method: result[0].method,
								useful_life_in_year: result[0].useful_life_in_year,
								useful_life_in_period: result[0].useful_life_in_period,
								is_after_15_start_next_month: result[0].is_after_15_start_next_month,
								acquired_date: result[0].acquired_date,
								acquired_value: result[0].acquired_value,
								salvage_value: result[0].salvage_value,
								last_depreciation_value: result[0].last_depreciation_value,
								last_accumulated_depreciation_value: result[0].last_accumulated_depreciation_value,
								last_book_value: result[0].last_book_value,
							},
							// default_account: {
							// 	asset: {
							// 		code: result[0].asset_code,
							// 		name: result[0].asset_name
							// 	},
							// 	accumulated_depreciation: {
							// 		code: result[0].,
							// 		name: result[0].
							// 	},
							// 	depreciation: {
							// 		code: result[0].,
							// 		name: result[0].
							// 	},
							// 	gain_on_sales: {
							// 		code: result[0].,
							// 		name: result[0].
							// 	},
							// 	loss_on_sales: {
							// 		code: result[0].,
							// 		name: result[0].
							// 	}
							// },
							// department: {
							// 	code: result[0].,
							// 	name: result[0].
							// }
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
