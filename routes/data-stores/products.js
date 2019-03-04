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
	    code: "5MP-001",
	    name: "500 mobile phones",
	    is_active: true,
	    is_salable: true,
	    is_purchasable: true,
	    is_tracked_as_inventory: false,
	    cogs_method: "avg",
	    length: 1,
	    width: 1,
	    height: 1,
	    weight: 1,
	    unit_cost: 0,
	    unit_price: 0,
	    unit_cogs: 0,
	    quantity: {
	        on_hand: 0,
	        on_hold: 0,
	        available: 0
	    },
	    category: {
	        name: "Products"
	    },
			unit: {
        code: "Pcs",
        name: "pieces"
	    },
	    default_account: {
	      sales: {
	          code: "53001",
	          name: "REVENUE - TRADE"
	      },
	      cogs: {
	          code: "63001",
	          name: "TRADING - PURCHASE"
	      }
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
			let sql = 'select count(*) AS "count" from INVENTOR as I join KELINV as KV on I.SUPPLIERALTERNATIF = KV.NOINDEX join UNIT as UT on I.IDUNITDASAR = UT.NOINDEX'

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
				+' 	"I"."KODE" as "code", '
				+' 	"I"."DESKRIPSI" as "name", '
				+' 	"I"."IS_ACTIVE" as "is_active", '
				+' 	"I"."IS_SALABLE" as "is_salable", '
				+' 	"I"."IS_PURCHASABLE" as "is_purchasable", '
				+' 	"I"."IS_TRACKED_AS_INVENTORY" as "is_tracked_as_inventory", '
				+' 	"I"."COGS_METHOD" as "cogs_method", '
				+' 	"I"."PANJANG" as "length", '
				+' 	"I"."LEBAR" as "width", '
				+' 	"I"."TINGGI" as "height", '
				+' 	"I"."BERAT" as "weight", '
				+' 	"I"."HARGASATUAN" as "unit_cost", '
				+' 	"I"."HARGAJUALSATUAN" as "unit_price", '
				+' 	"I"."HARGAPOKOKSATUAN" as "unit_cogs" '
				+' 	"I"."QTYONHAND" as "on_hand" '
				+' 	"I"."QTY_ON_HOLD" as "on_hold" '
				+' 	"I"."QTY_AVAILABLE" as "available" '
				+' 	"KV"."DESKRIPSI" as "category_name" '
				+' 	"UT"."KODEUNIT" as "unit_code" '
				+' 	"UT"."NAMAUNIT" as "unit_name" '
				+'from '
				+'	"INVENTOR" as "I" '
				+'	join "KELINV" as "KV" on I.SUPPLIERALTERNATIF = KV.NOINDEX'
				+'	join "UNIT" as "UT" on I.IDUNITDASAR = UT.NOINDEX'
				+'	left join "KIRAAN"'

				'INVENTOR as I join KELINV as KV on I.SUPPLIERALTERNATIF = KV.NOINDEX join UNIT as UT on I.IDUNITDASAR = UT.NOINDEX'
			db.query(sql, function(err, result) {
				if (err) {
					res.status(500).send({error: err})
				} else {

					let reqOptions = {
						method: 'POST',
						url: req.body.destination.url+'/api/v2/products',
						headers: {
							slug: req.body.destination.slug,
							Authorization: 'Bearer '+Buffer.from(req.body.token, 'base64').toString(),
							'Content-Type': 'application/json',
						},
						body: {
							code: result[0].code,
							name: result[0].name,
							is_active: (result[0].is_active!=='T') ? true : false,
							is_salable: (result[0].is_salable==='T') ? true : false,
							is_purchasable: (result[0].is_purchasable==='T') ? true : false,
							is_tracked_as_inventory: (result[0].is_tracked_as_inventory==='T') ? true : false,
							cogs_method: result[0].cogs_method,
							length: result[0].length,
							width: result[0].width,
							height: result[0].height,
							weight: result[0].weight,
							unit_cost: result[0].unit_cost,
							unit_price: result[0].unit_price,
							unit_cogs: result[0].unit_cogs,
							quantity: {
								on_hand: result[0].on_hand,
								on_hold: result[0].on_hold,
								available: result[0].available,
							},
							category: {
								name: result[0].category_name,
							},
							unit: {
								code: result[0].unit_code,
								name: result[0].unit_name,
							},
							default_account: {
								sales: {
									code: result[0].default_account_sales_code,
									name: result[0].default_account_sales_name,
								},
								cogs: {
									code: result[0].default_account_cogs_code,
									name: result[0].default_account_cogs_name,
								}
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
