const express = require('express')
const accounts = require('./data-stores/accounts')
const contacts = require('./data-stores/contacts')
const products = require('./data-stores/products')
const taxes = require('./data-stores/taxes')

const router = express.Router()

/* front end */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zahir' })
})

router.use('/accounts', accounts)
router.use('/contacts', contacts)
router.use('/products', products)
router.use('/taxes', taxes)

module.exports = router
