const express = require('express')
const auth = require('./auth')
const accounts = require('./data-stores/accounts')
const contacts = require('./data-stores/contacts')
const products = require('./data-stores/products')

const router = express.Router()

/* front end */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zahir' })
})

router.use('/auth', auth)
router.use('/accounts', accounts)
router.use('/contacts', contacts)
router.use('/products', products)

module.exports = router
